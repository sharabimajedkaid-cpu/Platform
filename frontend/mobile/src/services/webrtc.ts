import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ConsumerData {
  id: string;
  producerId: string;
  kind: string;
  rtpParameters: unknown;
}

export class MobileWebRTCService {
  private socket: WebSocket | null = null;
  private localStream: MediaStream | null = null;
  private sendTransportId: string = '';
  private recvTransportId: string = '';
  private consumers: Map<string, { track: MediaStreamTrack }> = new Map();
  private deviceLoaded = false;
  private routerRtpCapabilities: unknown = null;

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        return grants['android.permission.CAMERA'] === 'granted' &&
               grants['android.permission.RECORD_AUDIO'] === 'granted';
      } catch { return false; }
    }
    return true;
  }

  async joinClassroom(roomId: number, userId: string, token: string, signalingUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(`${signalingUrl}/signaling?roomId=${roomId}&token=${token}&userId=${userId}`);

      this.socket.onopen = () => {
        this.socket!.send(JSON.stringify({ type: 'join-rtc-room', roomId, userId }));
      };

      this.socket.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'rtc-joined':
            this.routerRtpCapabilities = msg.routerRtpCapabilities;
            this.deviceLoaded = true;
            await this.createTransport(roomId, 'send');
            await this.createTransport(roomId, 'recv');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: 'user' } });
            this.localStream = stream;
            resolve();
            break;
          case 'send-transport-created':
            this.sendTransportId = msg.id;
            break;
          case 'recv-transport-created':
            this.recvTransportId = msg.id;
            break;
          case 'new-producer':
            this.consumeRemoteStream(roomId, msg.producerId, this.routerRtpCapabilities);
            break;
          case 'consumed':
            break;
        }
      };

      this.socket.onerror = reject;
      setTimeout(() => reject(new Error('Timeout')), 15000);
    });
  }

  private async createTransport(roomId: number, direction: 'send' | 'recv'): Promise<void> {
    this.sendMessage({ type: `create-${direction}-transport`, roomId });
  }

  private async consumeRemoteStream(roomId: number, producerId: string, rtpCapabilities: unknown): Promise<void> {
    this.sendMessage({
      type: 'consume',
      roomId,
      producerId,
      rtpCapabilities,
      transportId: this.recvTransportId,
    });
  }

  private sendMessage(data: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  async getLocalStream(): Promise<MediaStream | null> {
    return this.localStream;
  }

  async toggleMute(): Promise<boolean> {
    if (this.localStream) {
      const track = this.localStream.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        return track.enabled;
      }
    }
    return false;
  }

  async toggleVideo(): Promise<boolean> {
    if (this.localStream) {
      const track = this.localStream.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        return track.enabled;
      }
    }
    return false;
  }

  async switchCamera(): Promise<void> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0] as any;
      if (videoTrack && videoTrack._switchCamera) {
        await videoTrack._switchCamera();
      }
    }
  }

  disconnect(): void {
    this.socket?.close();
    this.localStream?.getTracks().forEach(t => t.stop());
    this.socket = null;
    this.localStream = null;
    this.sendTransportId = '';
    this.recvTransportId = '';
    this.consumers.clear();
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const mobileWebRTC = new MobileWebRTCService();
