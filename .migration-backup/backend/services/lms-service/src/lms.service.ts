import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  teacherName: string;
  grade: string;
  maxStudents: number;
  enrolledCount: number;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  objectives: string[];
  duration: number;
  order: number;
  resources: LessonResource[];
}

export interface LessonResource {
  id: string;
  type: 'video' | 'document' | 'link' | 'image';
  title: string;
  url: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  score: number;
  maxScore: number;
  cefrLevel?: string;
  issuedAt: string;
  certificateUrl: string;
}

@Injectable()
export class LmsService {
  private readonly logger = new Logger(LmsService.name);
  private courses: Course[] = [];
  private lessons: Lesson[] = [];
  private certificates: Certificate[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    const courseNames = ['English A1', 'English A2', 'English B1', 'English B2', 'English C1', 'English C2',
      'Business English', 'Academic Writing', 'IELTS Preparation', 'TOEFL Preparation'];
    courseNames.forEach((name, i) => {
      this.courses.push({
        id: `course-${i + 1}`,
        name, code: `ENG-${String(i + 1).padStart(3, '0')}`,
        description: `Comprehensive ${name} course`,
        teacherId: `tch-${String((i % 6) + 1).padStart(3, '0')}`,
        teacherName: ['T.Suhair', "T.Wa'ad", 'T.Jamal', 'T.Amani', 'T.Khadeejah', 'T.Shihab'][i % 6],
        grade: name.split(' ')[1] || 'All',
        maxStudents: 50, enrolledCount: Math.floor(Math.random() * 30) + 10,
        status: 'active', createdAt: new Date().toISOString(),
      });
    });
  }

  getCourses(): Course[] { return this.courses; }
  getCourse(id: string): Course | undefined { return this.courses.find(c => c.id === id); }

  addCertificate(cert: Omit<Certificate, 'id' | 'issuedAt' | 'certificateUrl'>): Certificate {
    const newCert: Certificate = {
      ...cert, id: uuidv4(),
      issuedAt: new Date().toISOString(),
      certificateUrl: `https://britishce44.edu/certificates/${uuidv4()}`,
    };
    this.certificates.push(newCert);
    return newCert;
  }

  getCertificates(studentId?: string): Certificate[] {
    if (studentId) return this.certificates.filter(c => c.studentId === studentId);
    return this.certificates;
  }
}
