import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage?: Message;
  unreadCount: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text?: string;
  type: 'text' | 'voice' | 'image' | 'file' | 'video';
  mediaUrl?: string;
  readBy: string[];
  createdAt: string;
}

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();

  createConversation(participants: string[], participantNames: Record<string, string>): Conversation {
    const id = uuidv4();
    const conv: Conversation = {
      id, participants, participantNames,
      unreadCount: participants.reduce((acc, p) => ({ ...acc, [p]: 0 }), {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.conversations.set(id, conv);
    this.messages.set(id, []);
    return conv;
  }

  getConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values())
      .filter(c => c.participants.includes(userId))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getConversation(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  sendMessage(conversationId: string, senderId: string, senderName: string, text: string, type: 'text' | 'voice' | 'image' | 'file' | 'video' = 'text', mediaUrl?: string): Message {
    const conv = this.conversations.get(conversationId);
    if (!conv) throw new Error('Conversation not found');

    const msg: Message = {
      id: uuidv4(), conversationId, senderId, senderName, text, type, mediaUrl,
      readBy: [senderId], createdAt: new Date().toISOString(),
    };

    const msgs = this.messages.get(conversationId) || [];
    msgs.push(msg);
    this.messages.set(conversationId, msgs);

    conv.lastMessage = msg;
    conv.updatedAt = msg.createdAt;
    conv.participants.forEach(p => {
      if (p !== senderId) conv.unreadCount[p] = (conv.unreadCount[p] || 0) + 1;
    });

    return msg;
  }

  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  markAsRead(conversationId: string, userId: string): void {
    const conv = this.conversations.get(conversationId);
    if (conv) {
      conv.unreadCount[userId] = 0;
      const msgs = this.messages.get(conversationId) || [];
      msgs.forEach(m => { if (!m.readBy.includes(userId)) m.readBy.push(userId); });
    }
  }

  getUnreadCount(userId: string): number {
    return Array.from(this.conversations.values())
      .filter(c => c.participants.includes(userId))
      .reduce((total, c) => total + (c.unreadCount[userId] || 0), 0);
  }
}
