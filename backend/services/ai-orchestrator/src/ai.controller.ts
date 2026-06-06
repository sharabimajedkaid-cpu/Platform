import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AiTeachingAssistant } from './teaching-assistant.service';
import { AiAntiCheatService, AntiCheatEvent } from './anticheat.service';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private teachingAssistant: AiTeachingAssistant,
    private antiCheatService: AiAntiCheatService,
  ) {}

  @Post('completion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate AI completion' })
  async completion(@Body() body: { prompt: string; model?: string; temperature?: number; maxTokens?: number }) {
    return this.aiService.generateCompletion(body);
  }

  @Post('translate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Translate text' })
  async translate(@Body() body: { text: string; sourceLanguage: string; targetLanguage: string }) {
    return this.aiService.translate(body);
  }

  @Post('summarize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate text summary' })
  async summarize(@Body() body: { text: string; maxLength?: number }) {
    return this.aiService.generateSummary(body);
  }

  @Post('lesson-plan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate AI lesson plan' })
  async lessonPlan(@Body() body: { topic: string; level: string; duration: number }) {
    return this.aiService.generateLessonPlan(body.topic, body.level, body.duration);
  }

  @Post('subtitles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate subtitles from audio' })
  async subtitles(@Body() body: { audioUrl: string; language?: string }) {
    return this.aiService.generateSubtitles(body.audioUrl, body.language);
  }

  @Post('teaching-assistant')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ask AI teaching assistant' })
  async teachingAssistantQuery(@Body() body: { query: string; context?: string }) {
    return this.teachingAssistant.respond(body.query, body.context);
  }

  @Post('anticheat/analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze exam session for cheating' })
  async analyzeCheat(@Body() body: { sessionId: string; events: { type: string; data: unknown }[] }) {
    const events: AntiCheatEvent[] = body.events.map(e => ({
      type: e.type as AntiCheatEvent['type'], data: e.data as Record<string, unknown>, timestamp: new Date().toISOString(),
    }));
    return this.antiCheatService.analyzeSession(body.sessionId, events);
  }

  @Get('health')
  health() {
    return { status: 'ok', service: 'ai-orchestrator', version: '4.4.0' };
  }
}
