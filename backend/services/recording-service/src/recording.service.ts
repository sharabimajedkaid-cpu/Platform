import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface RecordingSession {
  id: string; classroomId: number; startedBy: string;
  status: string; startedAt: string; endedAt?: string;
  duration?: number; fileUrl?: string; transcriptUrl?: string;
  participants: string[];
}

@Injectable()
export class RecordingService {
  private readonly logger = new Logger(RecordingService.name);
  private recordings: RecordingSession[] = [];

  startRecording(classroomId: number, userId: string): RecordingSession {
    const rec: RecordingSession = {
      id: `rec-${uuidv4().slice(0, 8)}`, classroomId, startedBy: userId,
      status: 'recording', startedAt: new Date().toISOString(),
      participants: [userId],
    };
    this.recordings.push(rec);
    this.logger.log(`Recording started for classroom ${classroomId}`);
    return rec;
  }

  stopRecording(id: string): RecordingSession | null {
    const rec = this.recordings.find(r => r.id === id);
    if (!rec) return null;
    rec.status = 'processing';
    rec.endedAt = new Date().toISOString();
    rec.duration = (new Date(rec.endedAt).getTime() - new Date(rec.startedAt).getTime()) / 1000;
    rec.fileUrl = `https://storage.britishce44.edu/recordings/${id}.mp4`;
    return rec;
  }

  async processRecording(id: string): Promise<RecordingSession | null> {
    const rec = this.recordings.find(r => r.id === id);
    if (!rec) return null;
    rec.status = 'completed';
    rec.transcriptUrl = `https://storage.britishce44.edu/transcripts/${id}.json`;
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
