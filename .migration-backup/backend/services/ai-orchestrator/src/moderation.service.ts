import { Injectable } from '@nestjs/common';

@Injectable()
export class AiContentModerationService {
  private readonly blockedPatterns = [
    'hate speech', 'violence', 'explicit', 'harassment', 'bullying',
    'discrimination', 'threat', 'abuse', 'spam', 'scam',
  ];

  moderateText(text: string): { isAppropriate: boolean; flaggedTerms: string[]; confidence: number } {
    const lower = text.toLowerCase();
    const flaggedTerms = this.blockedPatterns.filter(pattern => lower.includes(pattern));
    return {
      isAppropriate: flaggedTerms.length === 0,
      flaggedTerms,
      confidence: flaggedTerms.length > 0 ? 0.98 : 0.85,
    };
  }

  moderateImage(imageUrl: string): Promise<{ isAppropriate: boolean; categories: string[]; confidence: number }> {
    return Promise.resolve({
      isAppropriate: true,
      categories: [],
      confidence: 0.9,
    });
  }

  moderateVideo(videoUrl: string): Promise<{ isAppropriate: boolean; segments: { start: number; end: number; risk: string }[] }> {
    return Promise.resolve({
      isAppropriate: true,
      segments: [],
    });
  }
}
