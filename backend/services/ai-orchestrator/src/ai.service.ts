import { Injectable, Logger } from '@nestjs/common';

export interface AiCompletionRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  context?: Record<string, unknown>;
}

export interface AiCompletionResponse {
  text: string;
  model: string;
  tokensUsed: number;
  finishReason: string;
}

export interface AiTranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AiSummaryRequest {
  text: string;
  maxLength?: number;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async generateCompletion(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const start = Date.now();
    const response = await this.callLlm(request.prompt, request.model, request.temperature, request.maxTokens);
    this.logger.log(`LLM call completed in ${Date.now() - start}ms`);
    return response;
  }

  private async callLlm(prompt: string, model = 'gpt-4', temperature = 0.7, maxTokens = 1024): Promise<AiCompletionResponse> {
    const mockResponses: Record<string, string> = {
      'lesson': 'Here is a structured lesson plan with clear objectives, activities, and assessments suitable for a 45-minute class.',
      'quiz': 'Generate a 10-question quiz covering the key concepts with multiple choice and short answer questions.',
      'grade': 'The student has demonstrated good understanding of core concepts. Grade: 85/100. Areas for improvement: vocabulary usage.',
      'translate': 'Translation complete. The text has been translated while preserving meaning and cultural context.',
      'summarize': 'Summary: This text covers the main educational concepts with key takeaways for student learning outcomes.',
    };

    const key = Object.keys(mockResponses).find(k => prompt.toLowerCase().includes(k));
    const text = key ? mockResponses[key] : `AI response for: "${prompt.substring(0, 100)}..."`;

    return {
      text,
      model,
      tokensUsed: prompt.length + text.length,
      finishReason: 'stop',
    };
  }

  async translate(request: AiTranslationRequest): Promise<{ translatedText: string; confidence: number }> {
    return {
      translatedText: `[${request.sourceLanguage}→${request.targetLanguage}] ${request.text}`,
      confidence: 0.95,
    };
  }

  async generateSummary(request: AiSummaryRequest): Promise<{ summary: string; originalLength: number; summaryLength: number }> {
    return {
      summary: request.text.substring(0, request.maxLength || 200) + '...',
      originalLength: request.text.length,
      summaryLength: Math.min(request.text.length, request.maxLength || 200),
    };
  }

  async generateSubtitles(audioUrl: string, language = 'en'): Promise<{ subtitles: { start: number; end: number; text: string }[] }> {
    return {
      subtitles: [
        { start: 0, end: 2.5, text: 'Welcome to Britishce44 online classroom.' },
        { start: 2.5, end: 5.0, text: 'Today we will learn about English grammar.' },
        { start: 5.0, end: 8.0, text: 'Please pay attention to the examples.' },
      ],
    };
  }

  async generateLessonPlan(topic: string, level: string, duration: number): Promise<{
    title: string; objectives: string[]; materials: string[]; activities: { time: number; activity: string }[];
  }> {
    return {
      title: `Lesson: ${topic}`,
      objectives: [`Understand key concepts of ${topic}`, `Apply ${topic} in practical exercises`, `Demonstrate comprehension through assessment`],
      materials: ['Whiteboard', 'Presentation slides', 'Worksheets'],
      activities: [
        { time: 5, activity: 'Warm-up discussion' },
        { time: 15, activity: `Introduction to ${topic}` },
        { time: 15, activity: 'Guided practice' },
        { time: 10, activity: 'Assessment and review' },
      ],
    };
  }
}
