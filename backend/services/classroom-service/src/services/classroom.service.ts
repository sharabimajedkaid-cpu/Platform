import { Injectable, Logger } from '@nestjs/common';

export interface Classroom {
  id: number;
  name: string;
  teacher: string;
  teacherId: string;
  grade: string;
  students: number;
  status: 'active' | 'available' | 'upcoming' | 'archived';
  maxParticipants: number;
  isRecording: boolean;
  startedAt?: string;
  participants: ClassroomParticipant[];
}

export interface ClassroomParticipant {
  id: string;
  userId: string;
  name: string;
  role: string;
  joinedAt: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  raisedHand: boolean;
}

@Injectable()
export class ClassroomService {
  private readonly logger = new Logger(ClassroomService.name);
  private classrooms: Map<number, Classroom> = new Map();

  constructor() {
    this.initializeClassrooms();
  }

  private initializeClassrooms() {
    const teachers = ['Prof. Anderson', 'Dr. Williams', 'Ms. Garcia', 'Mr. Brown', 'Mrs. Davis', 'Dr. Miller',
      'T.Suhair Almojahid', "T.Wa'ad Alhammadi", 'T.Jamal Alshameeri', 'T.Amani Alsharabi',
      'T.Khadeejah Alghaily', 'T.Shihab Alomary'];
    for (let i = 1; i <= 240; i++) {
      this.classrooms.set(i, {
        id: i,
        name: `Classroom ${i}`,
        teacher: teachers[i % teachers.length],
        teacherId: `tch-${String((i % 12) + 1).padStart(3, '0')}`,
        grade: `Grade ${Math.floor((i - 1) / 20) + 1}`,
        students: Math.floor(Math.random() * 25) + 5,
        status: i <= 40 ? 'active' : i <= 80 ? 'available' : 'upcoming',
        maxParticipants: 100,
        isRecording: false,
        participants: [],
      });
    }
  }

  getAllClassrooms(): Classroom[] {
    return Array.from(this.classrooms.values());
  }

  getClassroom(id: number): Classroom | undefined {
    return this.classrooms.get(id);
  }

  getActiveClassrooms(): Classroom[] {
    return Array.from(this.classrooms.values()).filter(c => c.status === 'active');
  }

  async joinClassroom(roomId: number, participant: Omit<ClassroomParticipant, 'joinedAt'>): Promise<Classroom> {
    const room = this.classrooms.get(roomId);
    if (!room) throw new Error('Classroom not found');
    if (room.participants.length >= room.maxParticipants) throw new Error('Classroom is full');

    room.participants.push({ ...participant, joinedAt: new Date().toISOString() });
    if (room.status === 'upcoming') room.status = 'active';
    if (!room.startedAt) room.startedAt = new Date().toISOString();
    return room;
  }

  async leaveClassroom(roomId: number, userId: string): Promise<Classroom> {
    const room = this.classrooms.get(roomId);
    if (!room) throw new Error('Classroom not found');
    room.participants = room.participants.filter(p => p.userId !== userId);
    return room;
  }

  async toggleRaiseHand(roomId: number, userId: string): Promise<boolean> {
    const room = this.classrooms.get(roomId);
    if (!room) throw new Error('Classroom not found');
    const participant = room.participants.find(p => p.userId === userId);
    if (!participant) throw new Error('Participant not found');
    participant.raisedHand = !participant.raisedHand;
    return participant.raisedHand;
  }

  async toggleMute(roomId: number, userId: string, muted: boolean): Promise<void> {
    const room = this.classrooms.get(roomId);
    if (!room) throw new Error('Classroom not found');
    const participant = room.participants.find(p => p.userId === userId);
    if (participant) participant.isMuted = muted;
  }

  async toggleVideo(roomId: number, userId: string, on: boolean): Promise<void> {
    const room = this.classrooms.get(roomId);
    if (!room) throw new Error('Classroom not found');
    const participant = room.participants.find(p => p.userId === userId);
    if (participant) participant.isVideoOn = on;
  }

  async setScreenSharing(roomId: number, userId: string, sharing: boolean): Promise<void> {
    const room = this.classrooms.get(roomId);
    if (room) {
      room.participants.forEach(p => p.isScreenSharing = false);
      const participant = room.participants.find(p => p.userId === userId);
      if (participant) participant.isScreenSharing = sharing;
    }
  }

  getParticipants(roomId: number): ClassroomParticipant[] {
    const room = this.classrooms.get(roomId);
    return room?.participants || [];
  }

  getParticipantCount(roomId: number): number {
    return this.classrooms.get(roomId)?.participants.length || 0;
  }
}
