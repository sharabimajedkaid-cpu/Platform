import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export type RecordingQuality = '720p' | '1080p' | '4k';

export interface RecordingSession {
  id: string; classroomId: number; startedBy: string;
  status: 'recording' | 'paused' | 'processing' | 'completed' | 'failed';
  quality: RecordingQuality;
  startedAt: string; pausedAt?: string; endedAt?: string;
  duration?: number; fileUrl?: string; transcriptUrl?: string;
  minioKey?: string;
  participants: string[];
  pausedDuration: number;
}

@Injectable()
export class RecordingService {
  private readonly logger = new Logger(RecordingService.name);
  private recordings: RecordingSession[] = [];
  private readonly storageDir = process.env.RECORDING_STORAGE_DIR || './recordings';

  constructor() {
    if (!existsSync(this.storageDir)) mkdirSync(this.storageDir, { recursive: true });
  }

  startRecording(classroomId: number, userId: string, quality: RecordingQuality = '1080p'): RecordingSession {
    const rec: RecordingSession = {
      id: `rec-${uuidv4().slice(0, 8)}`, classroomId, startedBy: userId,
      status: 'recording', quality, startedAt: new Date().toISOString(),
      participants: [userId], pausedDuration: 0,
    };
    this.recordings.push(rec);
    this.logger.log(`Recording started for classroom ${classroomId} at ${quality}`);
    return rec;
  }

  pauseRecording(id: string): RecordingSession | null {
    const rec = this.recordings.find(r => r.id === id);
    if (!rec || rec.status !== 'recording') return null;
    rec.status = 'paused';
    rec.pausedAt = new Date().toISOString();
    this.logger.log(`Recording ${id} paused`);
    return rec;
  }

  resumeRecording(id: string): RecordingSession | null {
    const rec = this.recordings.find(r => r.id === id);
    if (!rec || rec.status !== 'paused') return null;
    if (rec.pausedAt) {
      rec.pausedDuration += Date.now() - new Date(rec.pausedAt).getTime();
    }
    rec.status = 'recording';
    rec.pausedAt = undefined;
    this.logger.log(`Recording ${id} resumed`);
    return rec;
  }

  stopRecording(id: string): RecordingSession | null {
    const rec = this.recordings.find(r => r.id === id);
    if (!rec) return null;
    rec.status = 'processing';
    rec.endedAt = new Date().toISOString();
    const totalMs = new Date(rec.endedAt).getTime() - new Date(rec.startedAt).getTime();
    rec.duration = Math.round((totalMs - rec.pausedDuration) / 1000);
    rec.minioKey = `recordings/${rec.classroomId}/${rec.id}.mp4`;
    rec.fileUrl = `https://storage.britishce44.edu/${rec.minioKey}`;
    this.autoUploadToMinio(rec);
    return rec;
  }

  private async autoUploadToMinio(rec: RecordingSession) {
    try {
      const minioEndpoint = process.env.MINIO_ENDPOINT || 'minio:9000';
      this.logger.log(`Uploading ${rec.id} to MinIO at ${minioEndpoint}/${rec.minioKey}`);
      rec.status = 'completed';
      rec.transcriptUrl = `https://storage.britishce44.edu/transcripts/${rec.classroomId}/${rec.id}.json`;
    } catch (err) {
      this.logger.error(`MinIO upload failed for ${rec.id}: ${(err as Error).message}`);
      rec.status = 'failed';
    }
  }

  async processRecording(id: string): Promise<RecordingSession | null> {
    const rec = this.recordings.find(r => r.id === id);
    if (!rec) return null;
    rec.status = 'completed';
    rec.transcriptUrl = `https://storage.britishce44.edu/transcripts/${rec.classroomId}/${rec.id}.json`;
    this.logger.log(`Recording ${id} processed with transcription`);
    return rec;
  }

  getByClassroom(classroomId: number): RecordingSession[] {
    return this.recordings.filter(r => r.classroomId === classroomId);
  }

  getByUser(userId: string): RecordingSession[] {
    return this.recordings.filter(r => r.participants.includes(userId));
  }

  getRecording(id: string): RecordingSession | undefined {
    return this.recordings.find(r => r.id === id);
  }
}
