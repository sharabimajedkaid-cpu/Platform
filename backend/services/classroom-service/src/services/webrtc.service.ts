import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mediasoup from 'mediasoup';
import { types as mediasoupTypes } from 'mediasoup';
import { mediasoupConfig } from '../config/mediasoup.config';

interface RoomState {
  router: mediasoupTypes.Router;
  transports: Map<string, mediasoupTypes.WebRtcTransport>;
  producers: Map<string, mediasoupTypes.Producer>;
  consumers: Map<string, mediasoupTypes.Consumer>;
}

@Injectable()
export class WebRTCService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebRTCService.name);
  private workers: mediasoupTypes.Worker[] = [];
  private workerIndex = 0;
  private rooms: Map<number, RoomState> = new Map();

  async onModuleInit() {
    await this.createWorkers();
    this.logger.log(`Mediasoup initialized with ${this.workers.length} workers`);
  }

  async onModuleDestroy() {
    for (const room of this.rooms.values()) {
      room.router.close();
    }
    for (const worker of this.workers) {
      worker.close();
    }
    this.rooms.clear();
    this.logger.log('Mediasoup workers closed');
  }

  private async createWorkers() {
    const { worker: workerConfig } = mediasoupConfig;
    for (let i = 0; i < workerConfig.numWorkers; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: workerConfig.logLevel,
        logTags: workerConfig.logTags,
        rtcMinPort: workerConfig.rtcMinPort,
        rtcMaxPort: workerConfig.rtcMaxPort,
      });
      worker.on('died', () => {
        this.logger.error(`Mediasoup worker ${i} died, exiting`);
        process.exit(1);
      });
      this.workers.push(worker);
    }
  }

  private getNextWorker(): mediasoupTypes.Worker {
    const worker = this.workers[this.workerIndex % this.workers.length];
    this.workerIndex++;
    return worker;
  }

  async createRoom(roomId: number): Promise<void> {
    if (this.rooms.has(roomId)) return;
    const worker = this.getNextWorker();
    const router = await worker.createRouter({
      mediaCodecs: mediasoupConfig.router.mediaCodecs,
    });
    this.rooms.set(roomId, {
      router,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    });
    this.logger.log(`Room ${roomId} created with router`);
  }

  getRouterRtpCapabilities(roomId: number): mediasoupTypes.RtpCapabilities | null {
    return this.rooms.get(roomId)?.router.rtpCapabilities || null;
  }

  async createSendTransport(roomId: number) {
    return this.createTransport(roomId, 'send');
  }

  async createRecvTransport(roomId: number) {
    return this.createTransport(roomId, 'recv');
  }

  private async createTransport(roomId: number, direction: 'send' | 'recv') {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found`);
    const transport = await room.router.createWebRtcTransport({
      listenIps: mediasoupConfig.webRtcTransport.listenIps,
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
      initialAvailableOutgoingBitrate: mediasoupConfig.webRtcTransport.initialAvailableOutgoingBitrate,
    });
    if (mediasoupConfig.webRtcTransport.maxIncomingBitrate) {
      try { await transport.setMaxIncomingBitrate(mediasoupConfig.webRtcTransport.maxIncomingBitrate); } catch {}
    }
    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') transport.close();
    });
    transport.on('sctpstatechange', (sctpState) => {
      if (sctpState === 'closed') transport.close();
    });
    room.transports.set(transport.id, transport);
    this.logger.log(`${direction} transport ${transport.id} created in room ${roomId}`);
    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  async connectTransport(roomId: number, transportId: string, dtlsParameters: mediasoupTypes.DtlsParameters) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found`);
    const transport = room.transports.get(transportId);
    if (!transport) throw new Error(`Transport ${transportId} not found`);
    await transport.connect({ dtlsParameters });
    this.logger.log(`Transport ${transportId} connected in room ${roomId}`);
  }

  async produce(roomId: number, transportId: string, kind: mediasoupTypes.MediaKind, rtpParameters: mediasoupTypes.RtpParameters): Promise<mediasoupTypes.Producer> {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found`);
    const transport = room.transports.get(transportId) as mediasoupTypes.WebRtcTransport;
    if (!transport) throw new Error(`Transport ${transportId} not found`);
    const producer = await transport.produce({ kind, rtpParameters });
    room.producers.set(producer.id, producer);
    producer.on('transportclose', () => {
      producer.close();
      room.producers.delete(producer.id);
    });
    this.logger.log(`Producer ${producer.id} (${kind}) created in room ${roomId}`);
    return producer;
  }

  async consume(roomId: number, transportId: string, producerId: string, rtpCapabilities: mediasoupTypes.RtpCapabilities) {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found`);
    const transport = room.transports.get(transportId) as mediasoupTypes.WebRtcTransport;
    if (!transport) throw new Error(`Transport ${transportId} not found`);
    const producer = room.producers.get(producerId);
    if (!producer) throw new Error(`Producer ${producerId} not found`);
    if (!room.router.canConsume({ producerId, rtpCapabilities })) {
      throw new Error(`Cannot consume producer ${producerId}`);
    }
    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: false,
    });
    room.consumers.set(consumer.id, consumer);
    consumer.on('transportclose', () => {
      consumer.close();
      room.consumers.delete(consumer.id);
    });
    consumer.on('producerclose', () => {
      consumer.close();
      room.consumers.delete(consumer.id);
    });
    this.logger.log(`Consumer ${consumer.id} created in room ${roomId}`);
    return {
      id: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      type: consumer.type,
    };
  }

  async closeProducer(roomId: number, producerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const producer = room.producers.get(producerId);
    if (!producer) return;
    producer.close();
    room.producers.delete(producerId);
    room.consumers.forEach((consumer, id) => {
      if (consumer.producerId === producerId) {
        consumer.close();
        room.consumers.delete(id);
      }
    });
    this.logger.log(`Producer ${producerId} closed in room ${roomId}`);
  }

  async closeTransport(roomId: number, transportId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    const transport = room.transports.get(transportId);
    if (!transport) return;
    transport.close();
    room.transports.delete(transportId);
    this.logger.log(`Transport ${transportId} closed in room ${roomId}`);
  }

  async closeRoom(roomId: number) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.producers.forEach(p => p.close());
    room.consumers.forEach(c => c.close());
    room.transports.forEach(t => t.close());
    room.router.close();
    this.rooms.delete(roomId);
    this.logger.log(`Room ${roomId} closed and removed`);
  }

  getRoomSize(roomId: number): number {
    const room = this.rooms.get(roomId);
    if (!room) return 0;
    return room.transports.size;
  }

  getRouter(roomId: number): mediasoupTypes.Router | undefined {
    return this.rooms.get(roomId)?.router;
  }

  getWorker(): mediasoupTypes.Worker {
    return this.getNextWorker();
  }

  async restartIce(roomId: number, transportId: string): Promise<mediasoupTypes.IceParameters> {
    const room = this.rooms.get(roomId);
    if (!room) throw new Error(`Room ${roomId} not found`);
    const transport = room.transports.get(transportId);
    if (!transport) throw new Error(`Transport ${transportId} not found`);
    const iceParameters = await transport.restartIce();
    this.logger.log(`ICE restarted for transport ${transportId} in room ${roomId}`);
    return iceParameters;
  }

  getStats() {
    return {
      activeRooms: this.rooms.size,
      activeWorkers: this.workers.length,
      totalTransports: Array.from(this.rooms.values()).reduce((s, r) => s + r.transports.size, 0),
      totalProducers: Array.from(this.rooms.values()).reduce((s, r) => s + r.producers.size, 0),
      totalConsumers: Array.from(this.rooms.values()).reduce((s, r) => s + r.consumers.size, 0),
    };
  }
}
