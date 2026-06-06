import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface RTCParticipant {
  id: string;
  userId: string;
  name: string;
  roomId: number;
  transportId?: string;
  producerIds: string[];
  consumerIds: string[];
}

export interface RTCTransport {
  id: string;
  participantId: string;
  type: 'webrtc' | 'plain';
  direction: 'send' | 'recv';
}

export interface RTCProducer {
  id: string;
  participantId: string;
  transportId: string;
  kind: 'audio' | 'video' | 'screen';
  rtpParameters: unknown;
}

export interface RTCConsumer {
  id: string;
  participantId: string;
  transportId: string;
  producerId: string;
  kind: 'audio' | 'video' | 'screen';
  rtpParameters: unknown;
}

@Injectable()
export class WebRTCService {
  private readonly logger = new Logger(WebRTCService.name);
  private rooms: Map<number, {
    participants: Map<string, RTCParticipant>;
    transports: Map<string, RTCTransport>;
    producers: Map<string, RTCProducer>;
    consumers: Map<string, RTCConsumer>;
  }> = new Map();

  async createRoom(roomId: number): Promise<void> {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        participants: new Map(),
        transports: new Map(),
        producers: new Map(),
        consumers: new Map(),
      });
      this.logger.log(`WebRTC room ${roomId} created`);
    }
  }

  async joinRoom(roomId: number, userId: string, name: string): Promise<RTCParticipant> {
    await this.createRoom(roomId);
    const room = this.rooms.get(roomId)!;
    const participant: RTCParticipant = {
      id: uuidv4(),
      userId,
      name,
      roomId,
      producerIds: [],
      consumerIds: [],
    };
    room.participants.set(participant.id, participant);
    this.logger.log(`Participant ${name} joined room ${roomId}`);
    return participant;
  }

  async leaveRoom(roomId: number, participantId: string): Promise<void> {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.participants.delete(participantId);
    room.producers.forEach((p, id) => {
      if (p.participantId === participantId) room.producers.delete(id);
    });
    room.consumers.forEach((c, id) => {
      if (c.participantId === participantId) room.consumers.delete(id);
    });
    if (room.participants.size === 0) {
      this.rooms.delete(roomId);
      this.logger.log(`Room ${roomId} deleted (empty)`);
    }
  }

  getRoomParticipants(roomId: number): RTCParticipant[] {
    return Array.from(this.rooms.get(roomId)?.participants.values() || []);
  }

  getRoomSize(roomId: number): number {
    return this.rooms.get(roomId)?.participants.size || 0;
  }

  getRouterRtpCapabilities(roomId: number) {
    return {
      codecs: [
        { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },
        { kind: 'video', mimeType: 'video/VP8', clockRate: 90000 },
        { kind: 'video', mimeType: 'video/VP9', clockRate: 90000 },
        { kind: 'video', mimeType: 'video/H264', clockRate: 90000, parameters: { 'profile-level-id': '42e01f' } },
        { kind: 'video', mimeType: 'video/AV1', clockRate: 90000 },
      ],
      headerExtensions: [],
      fecMechanisms: [],
    };
  }

  getStats(): Record<string, number> {
    let totalParticipants = 0;
    let totalProducers = 0;
    let totalConsumers = 0;
    this.rooms.forEach(room => {
      totalParticipants += room.participants.size;
      totalProducers += room.producers.size;
      totalConsumers += room.consumers.size;
    });
    return {
      activeRooms: this.rooms.size,
      totalParticipants,
      totalProducers,
      totalConsumers,
    };
  }
}
