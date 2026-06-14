import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Poll {
  id: string;
  classroomId: number;
  question: string;
  options: { id: string; text: string; votes: number }[];
  totalVotes: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  endedAt?: string;
}

@Injectable()
export class PollService {
  private readonly logger = new Logger(PollService.name);
  private polls: Poll[] = [];
  private userVotes: Map<string, Set<string>> = new Map();

  createPoll(classroomId: number, question: string, options: string[], createdBy: string): Poll {
    const poll: Poll = {
      id: `poll-${uuidv4().slice(0, 8)}`,
      classroomId,
      question,
      options: options.map(text => ({ id: uuidv4().slice(0, 8), text, votes: 0 })),
      totalVotes: 0,
      isActive: true,
      createdBy,
      createdAt: new Date().toISOString(),
    };
    this.polls.push(poll);
    this.logger.log(`Poll "${question}" created for classroom ${classroomId}`);
    return poll;
  }

  vote(pollId: string, userId: string, optionId: string): { poll: Poll | undefined; error?: string } {
    const poll = this.polls.find(p => p.id === pollId);
    if (!poll) return { poll: undefined, error: 'Poll not found' };
    if (!poll.isActive) return { poll: undefined, error: 'Poll is closed' };

    const userKey = `${pollId}:${userId}`;
    if (this.userVotes.get(userKey)?.has(optionId)) {
      return { poll: undefined, error: 'Already voted' };
    }

    const option = poll.options.find(o => o.id === optionId);
    if (!option) return { poll: undefined, error: 'Option not found' };

    option.votes++;
    poll.totalVotes++;

    if (!this.userVotes.has(userKey)) {
      this.userVotes.set(userKey, new Set());
    }
    this.userVotes.get(userKey)!.add(optionId);

    return { poll };
  }

  endPoll(pollId: string): Poll | undefined {
    const poll = this.polls.find(p => p.id === pollId);
    if (!poll) return undefined;
    poll.isActive = false;
    poll.endedAt = new Date().toISOString();
    this.logger.log(`Poll ${pollId} ended with ${poll.totalVotes} total votes`);
    return poll;
  }

  getActivePoll(classroomId: number): Poll | undefined {
    return this.polls.find(p => p.classroomId === classroomId && p.isActive);
  }

  getPollHistory(classroomId: number): Poll[] {
    return this.polls.filter(p => p.classroomId === classroomId);
  }
}
