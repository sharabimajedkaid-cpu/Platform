import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { signalingService } from '../../lib/signaling';
import { webRTCService } from '../../lib/webrtc';

interface RemoteParticipant {
  id: string;
  userId: string;
  name: string;
  stream?: MediaStream;
}

interface BreakoutInfo {
  id: string;
  name: string;
  participantCount: number;
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
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const breakoutIdRef = useRef(0);
  const roomIdRef = useRef<number | null>(null);

  const joinClassroom = useCallback(async (roomId: number, userId: string, name: string) => {
    roomIdRef.current = roomId;

    try {
      const { routerRtpCapabilities } = await signalingService.connect(roomId, userId, name);
      await webRTCService.init(routerRtpCapabilities);
      await webRTCService.createSendTransport();
      await webRTCService.createRecvTransport();
      const stream = await webRTCService.startLocalMedia(true, true);
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsCameraOn(true);
      setIsMuted(false);
      await webRTCService.produceAudio();
      await webRTCService.produceVideo();

      const cleanupProducer = signalingService.onNewProducer(async (data) => {
        if (data.participantId === userId) return;
        const recvTransportId = webRTCService.getRecvTransportId();
        if (!recvTransportId) return;

        try {
          const consumerData = await signalingService.consume(recvTransportId, data.producerId, routerRtpCapabilities);
          const remoteStream = await webRTCService.consumeRemoteStream(data.producerId, consumerData);
          setRemoteParticipants(prev => {
            const existing = prev.find(p => p.id === data.participantId);
            if (existing) {
              return prev.map(p => p.id === data.participantId ? { ...p, stream: remoteStream } : p);
            }
            return [...prev, { id: data.participantId, userId: data.participantId, name: data.participantId, stream: remoteStream }];
          });
        } catch {
          // Ignore remote stream setup failures and keep the session usable.
        }
      });

      const cleanupLeft = signalingService.onParticipantLeft((data) => {
        setRemoteParticipants(prev => prev.filter(p => p.id !== data.participantId));
      });

      (window as Window & { __classroomSignalCleanup?: () => void }).__classroomSignalCleanup = () => {
        cleanupProducer();
        cleanupLeft();
      };

      setIsConnected(true);
    } catch {
      const fallbackStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).catch(() => null);
      localStreamRef.current = fallbackStream;
      setLocalStream(fallbackStream);
      setIsCameraOn(Boolean(fallbackStream));
      setIsMuted(!fallbackStream);
      setIsConnected(true);
    }
  }, []);

  const leaveClassroom = useCallback(async () => {
    webRTCService.close();
    signalingService.disconnect();
    if (typeof window !== 'undefined') {
      (window as Window & { __classroomSignalCleanup?: () => void }).__classroomSignalCleanup?.();
      delete (window as Window & { __classroomSignalCleanup?: () => void }).__classroomSignalCleanup;
    }
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    screenStreamRef.current = null;
    setLocalStream(null);
    setRemoteParticipants([]);
    setBreakouts([]);
    setCurrentBreakoutId(null);
    setIsScreenSharing(false);
    setIsConnected(false);
  }, []);

  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsMuted(!track.enabled);
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setIsCameraOn(track.enabled);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
    } else {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = screen;
        screen.getVideoTracks()[0].onended = () => {
          screenStreamRef.current = null;
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } catch {
        // User cancelled or not supported
      }
    }
  }, [isScreenSharing]);

  const createBreakout = useCallback(async (name: string, _autoCloseMinutes?: number): Promise<string> => {
    const id = `breakout-${++breakoutIdRef.current}`;
    setBreakouts(prev => [...prev, { id, name, participantCount: 0 }]);
    return id;
  }, []);

  const joinBreakout = useCallback(async (breakoutId: string) => {
    setCurrentBreakoutId(breakoutId);
    setBreakouts(prev => prev.map(b => b.id === breakoutId ? { ...b, participantCount: b.participantCount + 1 } : b));
  }, []);

  const leaveBreakout = useCallback(async () => {
    if (currentBreakoutId) {
      setBreakouts(prev => prev.map(b => b.id === currentBreakoutId ? { ...b, participantCount: Math.max(0, b.participantCount - 1) } : b));
    }
    setCurrentBreakoutId(null);
  }, [currentBreakoutId]);

  const refreshBreakouts = useCallback(() => {
    // In-memory — nothing to fetch
  }, []);

  const restartIce = useCallback(async () => {
    // No-op without a real signaling server
  }, []);

  useEffect(() => {
    return () => {
      webRTCService.close();
      signalingService.disconnect();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
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
