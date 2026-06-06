import { Injectable, Logger } from '@nestjs/common';

export interface SearchResult {
  id: string; type: string; title: string; description: string;
  url: string; score: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  private index: Record<string, unknown[]> = {
    courses: [], classrooms: [], users: [], messages: [], exams: [], videos: [],
  };

  async indexData(type: string, id: string, data: Record<string, unknown>): Promise<void> {
    if (!this.index[type]) this.index[type] = [];
    const existing = this.index[type].findIndex((item: any) => item.id === id);
    if (existing >= 0) this.index[type][existing] = { id, ...data };
    else this.index[type].push({ id, ...data });
  }

  async search(query: string, types?: string[], limit = 20): Promise<SearchResult[]> {
    const lower = query.toLowerCase();
    const results: SearchResult[] = [];
    const targetTypes = types || Object.keys(this.index);

    for (const type of targetTypes) {
      const items = this.index[type] || [];
      for (const item of items as any[]) {
        const title = `${item.name || item.title || item.firstName || ''} ${item.lastName || ''}`;
        const description = item.description || item.body || item.text || '';
        if (title.toLowerCase().includes(lower) || description.toLowerCase().includes(lower)) {
          results.push({
            id: item.id || `${type}-${Date.now()}`,
            type, title: title.trim() || type,
            description: description.substring(0, 200),
            url: `/${type}/${item.id}`,
            score: title.toLowerCase().startsWith(lower) ? 1 : 0.5,
          });
        }
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  async deleteIndex(type: string, id: string): Promise<void> {
    if (this.index[type]) {
      this.index[type] = this.index[type].filter((item: any) => item.id !== id);
    }
  }

  async clearIndex(type?: string): Promise<void> {
    if (type) this.index[type] = [];
    else Object.keys(this.index).forEach(k => this.index[k] = []);
  }

  getStats(): Record<string, number> {
    return Object.entries(this.index).reduce((acc, [key, items]) => {
      acc[key] = items.length;
      return acc;
    }, {} as Record<string, number>);
  }
}
