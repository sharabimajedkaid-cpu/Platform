import { Injectable, Logger } from '@nestjs/common';

export interface WhiteboardState {
  elements: WhiteboardElement[];
  backgroundColor: string;
  lastModified: string;
  modifiedBy: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'path' | 'rect' | 'circle' | 'text' | 'line' | 'image';
  userId: string;
  data: Record<string, unknown>;
  createdAt: string;
}

@Injectable()
export class WhiteboardService {
  private readonly logger = new Logger(WhiteboardService.name);
  private whiteboards: Map<number, WhiteboardState> = new Map();

  getOrCreateWhiteboard(roomId: number): WhiteboardState {
    if (!this.whiteboards.has(roomId)) {
      this.whiteboards.set(roomId, {
        elements: [],
        backgroundColor: '#ffffff',
        lastModified: new Date().toISOString(),
        modifiedBy: '',
      });
    }
    return this.whiteboards.get(roomId)!;
  }

  addElement(roomId: number, element: Omit<WhiteboardElement, 'id' | 'createdAt'>): WhiteboardElement {
    const wb = this.getOrCreateWhiteboard(roomId);
    const newElement: WhiteboardElement = {
      ...element,
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    wb.elements.push(newElement);
    wb.lastModified = new Date().toISOString();
    wb.modifiedBy = element.userId;
    return newElement;
  }

  removeElement(roomId: number, elementId: string): boolean {
    const wb = this.whiteboards.get(roomId);
    if (!wb) return false;
    const index = wb.elements.findIndex(e => e.id === elementId);
    if (index === -1) return false;
    wb.elements.splice(index, 1);
    wb.lastModified = new Date().toISOString();
    return true;
  }

  clearWhiteboard(roomId: number, userId: string): void {
    const wb = this.whiteboards.get(roomId);
    if (wb) {
      wb.elements = [];
      wb.lastModified = new Date().toISOString();
      wb.modifiedBy = userId;
    }
  }

  getWhiteboard(roomId: number): WhiteboardState | null {
    return this.whiteboards.get(roomId) || null;
  }
}
