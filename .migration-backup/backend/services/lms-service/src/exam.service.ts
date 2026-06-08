import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Exam {
  id: string; model: string; number: number;
  type: 'Quiz1_ReadingListeningWriting' | 'Quiz2_GrammarVocabSpeakingWriting' | 'Speaking_ListeningDescription' | 'Final_AllSections';
  maxScore: number; durationMinutes: number; questions: number; created: string;
}

export interface ExamResult {
  id: string; examId: string; studentId: string; studentName: string;
  score: number; maxScore: number; passed: boolean; submittedAt: string;
  answers: { questionId: string; answer: string; score: number }[];
}

@Injectable()
export class ExamService {
  private readonly logger = new Logger(ExamService.name);
  private exams: Exam[] = [];
  private results: ExamResult[] = [];
  private readonly models = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  private readonly examTypes = ['Quiz1_ReadingListeningWriting', 'Quiz2_GrammarVocabSpeakingWriting', 'Speaking_ListeningDescription', 'Final_AllSections'] as const;

  constructor() { this.seedExams(); }

  private seedExams() {
    for (const model of this.models) {
      for (let i = 1; i <= 10; i++) {
        const type = this.examTypes[Math.floor(Math.random() * this.examTypes.length)];
        const maxScore = type.includes('Quiz1') ? 20 : type.includes('Quiz2') ? 30 : type.includes('Speaking') ? 20 : 30;
        this.exams.push({
          id: `exam-${model}-${i}`, model, number: i, type, maxScore,
          durationMinutes: 30, questions: Math.floor(Math.random() * 20) + 10,
          created: new Date().toISOString(),
        });
      }
    }
  }

  getExams(model?: string): Exam[] {
    if (model) return this.exams.filter(e => e.model === model);
    return this.exams;
  }

  getExamById(id: string): Exam | undefined { return this.exams.find(e => e.id === id); }

  getExamsByModel(model: string): Exam[] { return this.exams.filter(e => e.model === model); }

  submitExam(submission: { examId: string; studentId: string; studentName: string; answers: { questionId: string; answer: string }[] }): ExamResult {
    const exam = this.getExamById(submission.examId);
    if (!exam) throw new Error('Exam not found');
    const totalScore = Math.floor(Math.random() * exam.maxScore * 0.4) + Math.ceil(exam.maxScore * 0.3);
    const result: ExamResult = {
      id: uuidv4(), examId: submission.examId,
      studentId: submission.studentId, studentName: submission.studentName,
      score: Math.min(totalScore, exam.maxScore), maxScore: exam.maxScore,
      passed: totalScore / exam.maxScore >= 0.7,
      submittedAt: new Date().toISOString(),
      answers: submission.answers.map(a => ({ ...a, score: Math.floor(Math.random() * 10) + 1 })),
    };
    this.results.push(result);
    return result;
  }

  getResults(studentId?: string): ExamResult[] {
    if (studentId) return this.results.filter(r => r.studentId === studentId);
    return this.results;
  }
}
