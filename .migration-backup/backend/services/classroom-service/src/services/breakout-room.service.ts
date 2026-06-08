import { Injectable, Logger } from '@nestjs/common';
import { types as mediasoupTypes } from 'mediasoup';
import { mediasoupConfig } from '../config/mediasoup.config';
import { WebRTCService } from './webrtc.service';

interface BreakoutRoom {
  id: string;
  mainRoomId: number;
  name: string;
  router: mediasoupTypes.Router;
  participants: Set<string>;
  pipeTransport?: mediasoupTypes.PipeTransport;
  createdAt: number;
  autoCloseAt?: number;
}

@Injectable()
export class BreakoutRoomService {
  private readonly logger = new Logger(BreakoutRoomService.name);
  private breakoutRooms: Map<string, BreakoutRoom> = new Map();
  private participantToBreakout: Map<string, string> = new Map();
  private autoCloseTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  constructor(private webrtcService: WebRTCService) {}

  async createBreakoutRoom(mainRoomId: number, name: string, autoCloseMinutes?: number): Promise<string> {
    const mainRouter = this.webrtcService.getRouter(mainRoomId);
    if (!mainRouter) throw new Error(`Main room ${mainRoomId} not found`);

    const worker = this.webrtcService.getWorker();
    const router = await worker.createRouter({
      mediaCodecs: mediasoupConfig.router.mediaCodecs,
    });

    const pipeTransport = await mainRouter.createPipeTransport({
      listenIp: '0.0.0.0',
      enableSctp: false,
    });
    const mainPipeTransport = await router.createPipeTransport({
      listenIp: '0.0.0.0',
      enableSctp: false,
    });
    await pipeTransport.connect({
      ip: mainPipeTransport.tuple?.localIp || '127.0.0.1',
      port: mainPipeTransport.tuple?.localPort || 0,
    });
    await mainPipeTransport.connect({
      ip: pipeTransport.tuple?.localIp || '127.0.0.1',
      port: pipeTransport.tuple?.localPort || 0,
    });

    const id = `breakout-${mainRoomId}-${Date.now()}`;
    const breakout: BreakoutRoom = {
      id,
      mainRoomId,
      name,
      router,
      participants: new Set(),
      pipeTransport,
      createdAt: Date.now(),
      autoCloseAt: autoCloseMinutes ? Date.now() + autoCloseMinutes * 60 * 1000 : undefined,
    };

    this.breakoutRooms.set(id, breakout);

    if (autoCloseMinutes) {
      const timer = setTimeout(() => this.closeBreakoutRoom(id), autoCloseMinutes * 60 * 1000);
      this.autoCloseTimers.set(id, timer);
    }

    this.logger.log(`Breakout room "${name}" (${id}) created for main room ${mainRoomId}`);
    return id;
  }

  async joinBreakoutRoom(userId: string, breakoutId: string): Promise<void> {
    const breakout = this.breakoutRooms.get(breakoutId);
    if (!breakout) throw new Error(`Breakout room ${breakoutId} not found`);

    const currentBreakout = this.participantToBreakout.get(userId);
    if (currentBreakout) {
      await this.leaveBreakoutRoom(userId);
    }

    breakout.participants.add(userId);
    this.participantToBreakout.set(userId, breakoutId);
    this.logger.log(`User ${userId} joined breakout room ${breakoutId}`);
  }

  async leaveBreakoutRoom(userId: string): Promise<void> {
    const breakoutId = this.participantToBreakout.get(userId);
    if (!breakoutId) return;

    const breakout = this.breakoutRooms.get(breakoutId);
    if (breakout) {
      breakout.participants.delete(userId);
    }
    this.participantToBreakout.delete(userId);
    this.logger.log(`User ${userId} left breakout room ${breakoutId}`);
  }

  async closeBreakoutRoom(breakoutId: string): Promise<void> {
    const breakout = this.breakoutRooms.get(breakoutId);
    if (!breakout) return;

    const timer = this.autoCloseTimers.get(breakoutId);
    if (timer) clearTimeout(timer);

    breakout.pipeTransport?.close();
    breakout.participants.forEach(pid => this.participantToBreakout.delete(pid));
    breakout.router.close();
    this.breakoutRooms.delete(breakoutId);
    this.logger.log(`Breakout room ${breakoutId} closed`);
  }

  getBreakoutRoom(breakoutId: string): BreakoutRoom | undefined {
    return this.breakoutRooms.get(breakoutId);
  }

  getUserBreakout(userId: string): BreakoutRoom | undefined {
    const breakoutId = this.participantToBreakout.get(userId);
    if (!breakoutId) return undefined;
    return this.breakoutRooms.get(breakoutId);
  }

  getMainRoomBreakouts(mainRoomId: number): BreakoutRoom[] {
    return Array.from(this.breakoutRooms.values()).filter(b => b.mainRoomId === mainRoomId);
  }

  async closeAllForMainRoom(mainRoomId: number): Promise<void> {
    const breakouts = this.getMainRoomBreakouts(mainRoomId);
    for (const b of breakouts) {
      await this.closeBreakoutRoom(b.id);
    }
  }

  getStats() {
    return {
      activeBreakoutRooms: this.breakoutRooms.size,
      totalBreakoutParticipants: Array.from(this.breakoutRooms.values()).reduce((s, b) => s + b.participants.size, 0),
    };
  }
}
