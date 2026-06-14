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

interface BreakoutInfo {
  id: string; name: string; participantCount: number;
}

interface WebRTCContextValue {
  isConnected: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  localStream: MediaStream | null;
  remoteParticipants: RemoteParticipant[];
  breakouts: BreakoutInfo[];
  currentBreakoutId: string | null;
  joinClassroom: (roomId: number, userId: string, name: string) => Promise<void>;
  leaveClassroom: () => Promise<void>;
  toggleMic: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => Promise<void>;
  createBreakout: (name: string, autoCloseMinutes?: number) => Promise<string>;
  joinBreakout: (breakoutId: string) => Promise<void>;
  leaveBreakout: () => Promise<void>;
  refreshBreakouts: () => void;
  restartIce: () => Promise<void>;
}

const WebRTCContext = createContext<WebRTCContextValue | null>(null);

export function WebRTCProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([]);
  const [breakouts, setBreakouts] = useState<BreakoutInfo[]>([]);
  const [currentBreakoutId, setCurrentBreakoutId] = useState<string | null>(null);
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
      fetchTurnCredentials(userId);

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
    setBreakouts([]);
    setCurrentBreakoutId(null);
    setIsScreenSharing(false);
    setIsConnected(false);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      await webRTCService.stopScreenShare();
      setIsScreenSharing(false);
    } else {
      try {
        await webRTCService.produceScreen();
        setIsScreenSharing(true);
      } catch { /* cancelled or error */ }
    }
  }, [isScreenSharing]);

  const fetchTurnCredentials = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/classrooms/turn-credentials?userId=${userId}`);
      if (res.ok) {
        const creds = await res.json();
        if (typeof window !== 'undefined' && (window as any).__turnCreds === undefined) {
          (window as any).__turnCreds = creds;
        }
      }
    } catch { /* graceful fallback */ }
  }, []);

  const createBreakout = useCallback(async (name: string, autoCloseMinutes?: number): Promise<string> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/classrooms/${roomIdRef.current}/breakout/create`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, autoCloseMinutes }),
      });
      const data = await res.json();
      return data.id;
    } catch (err) {
      throw new Error('Failed to create breakout room');
    }
  }, []);

  const joinBreakout = useCallback(async (breakoutId: string) => {
    setCurrentBreakoutId(breakoutId);
  }, []);

  const leaveBreakout = useCallback(async () => {
    setCurrentBreakoutId(null);
  }, []);

  const refreshBreakouts = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/classrooms/${roomIdRef.current}/breakouts`);
      if (res.ok) {
        const data = await res.json();
        setBreakouts(data);
      }
    } catch { /* ignore */ }
  }, []);

  const restartIce = useCallback(async () => {
    try {
      await webRTCService.restartIce();
    } catch (err) {
      console.error('ICE restart failed:', err);
    }
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
      isScreenSharing,
      localStream,
      remoteParticipants,
      breakouts,
      currentBreakoutId,
      joinClassroom,
      leaveClassroom,
      toggleMic,
      toggleCamera,
      toggleScreenShare,
      createBreakout,
      joinBreakout,
      leaveBreakout,
      refreshBreakouts,
      restartIce,
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
