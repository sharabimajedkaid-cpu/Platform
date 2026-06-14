import { Injectable, Logger } from '@nestjs/common';

export interface DashboardMetrics {
  activeUsers: number; totalStudents: number; totalTeachers: number; totalClassrooms: number;
  activeClassrooms: number; examsTaken: number; homeworkSubmitted: number; messagesSent: number;
  videoArchives: number; revenueTotal: number;
}

export interface TimeSeriesDataPoint {
  label: string; value: number;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private events: { type: string; userId: string; metadata: Record<string, unknown>; timestamp: string }[] = [];

  trackEvent(type: string, userId: string, metadata: Record<string, unknown> = {}): void {
    this.events.push({ type, userId, metadata, timestamp: new Date().toISOString() });
    if (this.events.length > 10000) this.events = this.events.slice(-5000);
  }

  getDashboardMetrics(): DashboardMetrics {
    return {
      activeUsers: Math.floor(Math.random() * 100) + 20,
      totalStudents: 50, totalTeachers: 9, totalClassrooms: 240,
      activeClassrooms: Math.floor(Math.random() * 30) + 5,
      examsTaken: Math.floor(Math.random() * 200) + 50,
      homeworkSubmitted: Math.floor(Math.random() * 100) + 20,
      messagesSent: Math.floor(Math.random() * 1000) + 100,
      videoArchives: Math.floor(Math.random() * 50) + 10,
      revenueTotal: Math.floor(Math.random() * 50000) + 10000,
    };
  }

  getUserAnalytics(userId: string): { loginCount: number; lastActive: string; events: { type: string; count: number }[] } {
    const userEvents = this.events.filter(e => e.userId === userId);
    const eventCounts = userEvents.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return {
      loginCount: Math.floor(Math.random() * 50) + 1,
      lastActive: new Date().toISOString(),
      events: Object.entries(eventCounts).map(([type, count]) => ({ type, count })),
    };
  }

  getPerformanceMetrics(): { dailyActiveUsers: TimeSeriesDataPoint[]; classroomUsage: TimeSeriesDataPoint[] } {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return {
      dailyActiveUsers: days.map(d => ({ label: d, value: Math.floor(Math.random() * 80) + 20 })),
      classroomUsage: days.map(d => ({ label: d, value: Math.floor(Math.random() * 40) + 5 })),
    };
  }

  getEvents(type?: string): { type: string; userId: string; timestamp: string }[] {
    if (type) return this.events.filter(e => e.type === type).slice(-100);
    return this.events.slice(-100);
  }
}
