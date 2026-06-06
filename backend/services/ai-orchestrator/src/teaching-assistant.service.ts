import { Injectable } from '@nestjs/common';

@Injectable()
export class AiTeachingAssistant {
  private readonly knowledgeBase = [
    { topic: 'grammar', response: 'Grammar is the set of structural rules governing the composition of clauses, phrases, and words in a language.' },
    { topic: 'vocabulary', response: 'Building vocabulary requires consistent practice with reading, writing, and speaking exercises.' },
    { topic: 'pronunciation', response: 'Focus on minimal pairs, stress patterns, and intonation to improve pronunciation.' },
    { topic: 'writing', response: 'Good writing follows a clear structure: introduction, body paragraphs, and conclusion.' },
    { topic: 'listening', response: 'Practice active listening by focusing on main ideas, supporting details, and speaker intent.' },
    { topic: 'speaking', response: 'Regular speaking practice with native speakers or language partners improves fluency.' },
  ];

  async respond(query: string, context?: string): Promise<{ answer: string; confidence: number; sources?: string[] }> {
    const lower = query.toLowerCase();
    const match = this.knowledgeBase.find(k => lower.includes(k.topic));
    if (match) {
      return {
        answer: match.response + (context ? ` Based on the context: ${context.substring(0, 100)}...` : ''),
        confidence: 0.92,
        sources: ['Britishce44 Learning Materials'],
      };
    }
    return {
      answer: `That's a great question about "${query.substring(0, 50)}". I recommend reviewing the course materials and practicing regularly. Would you like me to provide more specific guidance?`,
      confidence: 0.75,
    };
  }
}
