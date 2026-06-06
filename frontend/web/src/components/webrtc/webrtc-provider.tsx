'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { signalingService, ConsumerData } from '../../lib/signaling';
import { webRTCService } from '../../lib/webrtc';

interface RemoteParticipant {
  id: string;
  userId: string;
  name: string;
  stream?: MediaStream;
}

interface WebRTCContextValue {
  isConnected: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  localStream: MediaStream | null;
  remoteParticipants: RemoteParticipant[];
  joinClassroom: (roomId: number, userId: string, name: string) => Promise<void>;
  leaveClassroom: () => Promise<void>;
  toggleMic: () => void;
  toggleCamera: () => void;
}

const WebRTCContext = createContext<WebRTCContextValue | null>(null);

export function WebRTCProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const roomIdRef = useRef<number | null>(null);

  const joinClassroom = useCallback(async (roomId: number, userId: string, name: string) => {
    try {
      const { routerRtpCapabilities } = await signalingService.connect(roomId, userId, name);
      roomIdRef.current = roomId;
      await webRTCService.init(routerRtpCapabilities);
      await webRTCService.createSendTransport();
      await webRTCService.createRecvTransport();
      const stream = await webRTCService.startLocalMedia(true, true);
      setLocalStream(stream);
      setIsCameraOn(true);
      setIsMuted(false);
      await webRTCService.produceAudio();
      await webRTCService.produceVideo();

      signalingService.onNewProducer(async (data) => {
        if (data.participantId === userId) return;
        const recvTransportId = webRTCService.getRecvTransportId();
        if (!recvTransportId) return;
        const consumerData = await signalingService.consume(
          recvTransportId,
          data.producerId,
          routerRtpCapabilities,
        );
        const stream = await webRTCService.consumeRemoteStream(data.producerId, consumerData);
        setRemoteParticipants(prev => {
          const existing = prev.find(p => p.id === data.participantId);
          if (existing) {
            return prev.map(p =>
              p.id === data.participantId ? { ...p, stream } : p
            );
          }
          return [...prev, { id: data.participantId, userId: data.participantId, name: '', stream }];
        });
      });

      signalingService.onParticipantLeft((data) => {
        setRemoteParticipants(prev => prev.filter(p => p.id !== data.participantId));
      });

      setIsConnected(true);
    } catch (err) {
      console.error('Failed to join classroom:', err);
      throw err;
    }
  }, []);

  const leaveClassroom = useCallback(async () => {
    webRTCService.close();
    signalingService.disconnect();
    roomIdRef.current = null;
    setLocalStream(null);
    setRemoteParticipants([]);
    setIsConnected(false);
  }, []);

  const toggleMic = useCallback(() => {
    const enabled = webRTCService.toggleMic();
    setIsMuted(!enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const enabled = webRTCService.toggleCamera();
    setIsCameraOn(enabled);
  }, []);

  useEffect(() => {
    return () => {
      if (roomIdRef.current) {
        webRTCService.close();
        signalingService.disconnect();
      }
    };
  }, []);

  return (
    <WebRTCContext.Provider value={{
      isConnected,
      isMuted,
      isCameraOn,
      localStream,
      remoteParticipants,
      joinClassroom,
      leaveClassroom,
      toggleMic,
      toggleCamera,
    }}>
      {children}
    </WebRTCContext.Provider>
  );
}

export function useWebRTC(): WebRTCContextValue {
  const ctx = useContext(WebRTCContext);
  if (!ctx) throw new Error('useWebRTC must be used within WebRTCProvider');
  return ctx;
}
