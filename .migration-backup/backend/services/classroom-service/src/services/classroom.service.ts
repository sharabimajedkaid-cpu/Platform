import { Injectable, Logger } from '@nestjs/common';

export interface Classroom {
  id: number;
  name: string;
  teacher: string;
  teacherId: string;
  subject: string;
  cefrLevel: string;
  schedule: string;
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
    const teachers = [
      { id: 'tch-001', name: 'T.Suhair Almojahid' },
      { id: 'tch-002', name: "T.Wa'ad Alhammadi" },
      { id: 'tch-003', name: 'T.Jamal Alshameeri' },
      { id: 'tch-004', name: 'T.Amani Alsharabi' },
      { id: 'tch-005', name: 'T.Khadeejah Alghaily' },
      { id: 'tch-006', name: 'T.Shihab Alomary' },
    ];
    const subjects = [
      'English Grammar', 'English Conversation', 'Academic Writing', 'Reading Comprehension',
      'IELTS Preparation', 'Business English', 'English for Kids', 'Advanced Literature',
    ];
    const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const schedules = [
      'Sat-Mon 09:00-10:30', 'Sat-Mon 11:00-12:30', 'Sat-Mon 14:00-15:30',
      'Sun-Tue 09:00-10:30', 'Sun-Tue 11:00-12:30', 'Sun-Tue 14:00-15:30',
      'Wed-Thu 09:00-10:30', 'Wed-Thu 11:00-12:30', 'Wed-Thu 14:00-15:30',
      'Mon-Wed 16:00-17:30',
    ];

    for (let i = 1; i <= 40; i++) {
      const teacher = teachers[(i - 1) % teachers.length];
      const subject = subjects[Math.floor((i - 1) / 5) % subjects.length];
      const cefrLevel = cefrLevels[Math.floor((i - 1) / 7) % cefrLevels.length];
      const schedule = schedules[(i - 1) % schedules.length];
      this.classrooms.set(i, {
        id: i,
        name: `Classroom ${i}`,
        teacher: teacher.name,
        teacherId: teacher.id,
        subject,
        cefrLevel,
        schedule,
        grade: `Grade ${Math.ceil(i / 4)}`,
        students: Math.floor(Math.random() * 20) + 10,
        status: i <= 10 ? 'active' : i <= 25 ? 'available' : 'upcoming',
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
    return this.classrooms.get(roomId)?.participants || [];
  }

  getParticipantCount(roomId: number): number {
    return this.classrooms.get(roomId)?.participants.length || 0;
  }
}
