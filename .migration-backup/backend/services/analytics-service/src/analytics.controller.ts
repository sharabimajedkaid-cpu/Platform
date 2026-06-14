import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ReportService } from './report.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService,
    private reportService: ReportService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  getDashboard() { return this.analyticsService.getDashboardMetrics(); }

  @Get('performance')
  @ApiOperation({ summary: 'Get performance metrics' })
  getPerformance() { return this.analyticsService.getPerformanceMetrics(); }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user analytics' })
  getUserAnalytics(@Param('userId') userId: string) { return this.analyticsService.getUserAnalytics(userId); }

  @Post('track')
  @ApiOperation({ summary: 'Track an event' })
  trackEvent(@Body() body: { type: string; userId: string; metadata?: Record<string, unknown> }) {
    this.analyticsService.trackEvent(body.type, body.userId, body.metadata);
    return { success: true };
  }

  @Get('events')
  @ApiOperation({ summary: 'Get tracked events' })
  getEvents(@Query('type') type?: string) { return this.analyticsService.getEvents(type); }

  @Get('reports/:type')
  @ApiOperation({ summary: 'Generate report (parent, teacher, management)' })
  generateReport(@Param('type') type: string) {
    return this.reportService.generateReport(type);
  }

  @Get('reports/export/:type')
  @ApiOperation({ summary: 'Export report as PDF' })
  exportReport(@Param('type') type: string) {
    return this.reportService.exportReport(type);
  }
}
