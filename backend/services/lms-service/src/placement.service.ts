import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface PlacementTestResult {
  id: string; studentId: string; studentName: string;
  score: number; maxScore: number; cefrLevel: string;
  fluency: number; accuracy: number; date: string;
}

@Injectable()
export class PlacementService {
  private results: PlacementTestResult[] = [];

  private readonly cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  getAll(): PlacementTestResult[] { return this.results; }

  submit(data: { studentId: string; studentName: string; score: number }): PlacementTestResult {
    const cefr = data.score < 13 ? 'A1' : data.score < 25 ? 'A2' : data.score < 38 ? 'B1' :
                 data.score < 50 ? 'B2' : data.score < 63 ? 'C1' : 'C2';
    const result: PlacementTestResult = {
      id: uuidv4(), ...data, maxScore: 76, cefrLevel: cefr,
      fluency: Math.floor(Math.random() * 30) + 65,
      accuracy: Math.floor(Math.random() * 25) + 70,
      date: new Date().toISOString(),
    };
    this.results.push(result);
    return result;
  }

  getByStudent(studentId: string): PlacementTestResult[] {
    return this.results.filter(r => r.studentId === studentId);
  }
}
