import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface HomeworkSubmission {
  id: string; studentId: string; studentName: string;
  fileName: string; fileSize: string; fileUrl?: string;
  date: string; status: 'submitted' | 'graded' | 'returned';
  grade?: number; feedback?: string;
}

@Injectable()
export class HomeworkService {
  private submissions: HomeworkSubmission[] = [];

  getAll(): HomeworkSubmission[] { return this.submissions; }

  submit(data: { studentId: string; studentName: string; fileName: string; fileSize: string }): HomeworkSubmission {
    const submission: HomeworkSubmission = {
      id: uuidv4(), ...data,
      fileUrl: `https://storage.britishce44.edu/homework/${uuidv4()}/${data.fileName}`,
      date: new Date().toISOString(), status: 'submitted',
    };
    this.submissions.push(submission);
    return submission;
  }

  grade(id: string, grade: number, feedback: string): HomeworkSubmission | null {
    const sub = this.submissions.find(s => s.id === id);
    if (!sub) return null;
    sub.grade = grade;
    sub.feedback = feedback;
    sub.status = 'graded';
    return sub;
  }

  getByStudent(studentId: string): HomeworkSubmission[] {
    return this.submissions.filter(s => s.studentId === studentId);
  }
}
