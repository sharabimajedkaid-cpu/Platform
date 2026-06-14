import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Application {
  id: string; studentName: string; parentName: string;
  email: string; phone: string; grade: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string; processedAt?: string; notes?: string;
}

@Injectable()
export class AdmissionsService {
  private applications: Application[] = [];

  getAll(): Application[] { return this.applications; }

  submit(data: { studentName: string; parentName: string; email: string; phone: string; grade: string }): Application {
    const app: Application = {
      id: `app-${uuidv4().slice(0, 8)}`, ...data,
      status: 'pending', submittedAt: new Date().toISOString(),
    };
    this.applications.push(app);
    return app;
  }

  process(id: string, status: 'approved' | 'rejected', notes?: string): Application | null {
    const app = this.applications.find(a => a.id === id);
    if (!app) return null;
    app.status = status;
    app.processedAt = new Date().toISOString();
    app.notes = notes;
    return app;
  }
}
