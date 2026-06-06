import { Platform, PermissionsAndroid } from 'react-native';

export interface RTCOptions {
  audio: boolean;
  video: boolean;
  screenShare?: boolean;
}

export class MobileWebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private signalingSocket: WebSocket | null = null;

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

  async initializeMedia(options: RTCOptions): Promise<MediaStream | null> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: options.audio,
        video: options.video ? { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } : false,
      };
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (err) {
      console.error('Failed to get media:', err);
      return null;
    }
  }

  async joinClassroom(roomId: number, token: string, signalingUrl: string): Promise<void> {
    this.signalingSocket = new WebSocket(`${signalingUrl}/signaling?roomId=${roomId}&token=${token}`);

    this.signalingSocket.onopen = () => {
      console.log('Signaling connected');
      this.signalingSocket?.send(JSON.stringify({ type: 'join', roomId }));
    };

    this.signalingSocket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      await this.handleSignalingMessage(msg);
    };

    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:turn.britishce44.edu:3478', username: 'britishce44', credential: 'your-turn-credential' },
      ],
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });
    }

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingSocket?.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };
  }

  private async handleSignalingMessage(msg: any): Promise<void> {
    switch (msg.type) {
      case 'offer':
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        const answer = await this.peerConnection?.createAnswer();
        await this.peerConnection?.setLocalDescription(answer);
        this.signalingSocket?.send(JSON.stringify({ type: 'answer', sdp: answer }));
        break;
      case 'answer':
        await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        break;
      case 'ice-candidate':
        await this.peerConnection?.addIceCandidate(new RTCIceCandidate(msg.candidate));
        break;
    }
  }

  async toggleMute(): Promise<boolean> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  async toggleVideo(): Promise<boolean> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
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
    this.peerConnection?.close();
    this.signalingSocket?.close();
    this.localStream?.getTracks().forEach(t => t.stop());
    this.peerConnection = null;
    this.signalingSocket = null;
    this.localStream = null;
  }

  isConnected(): boolean {
    return this.peerConnection?.connectionState === 'connected';
  }
}

export const mobileWebRTC = new MobileWebRTCService();
