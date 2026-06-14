export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  address?: string;
  grade?: number;
  classroomId?: number;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IClassroom {
  id: number;
  name: string;
  link: string;
  teacher: string;
  teacherId?: string;
  grade: string;
  students: number;
  status: ClassroomStatus;
  maxParticipants: number;
  isRecording: boolean;
  startedAt?: string;
}

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text?: string;
  type: MessageType;
  mediaUrl?: string;
  readBy: string[];
  createdAt: string;
}

export interface IConversation {
  id: string;
  participants: string[];
  lastMessage?: IMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IExam {
  id: string;
  model: string;
  number: number;
  type: ExamType;
  maxScore: number;
  durationMinutes: number;
  questions: number;
  created: string;
}

export interface IHomeworkSubmission {
  id: string;
  studentId: string;
  studentName: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  date: string;
  status: 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
}

export interface IVideoArchive {
  id: string;
  userId: string;
  userName: string;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  date: string;
  type: string;
  duration?: number;
  recordingId?: string;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

export interface ITeacherEvaluation {
  id: string;
  teacherId: string;
  teacherName: string;
  evaluatorId: string;
  total: number;
  criteria: ICriteriaScore[];
  date: string;
}

export interface ICriteriaScore {
  name: string;
  max: number;
  score: number;
}

export interface IDailyPerformance {
  id: string;
  teacherId: string;
  teacherName: string;
  total: number;
  criteria: IPerfCriteria[];
  date: string;
}

export interface IPerfCriteria {
  name: string;
  score: number;
}

export interface IPlacementResult {
  id: string;
  studentId: string;
  studentName: string;
  score: number;
  cefrLevel: CEFRLevel;
  fluency: number;
  accuracy: number;
  date: string;
}

export interface ISubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: PaymentStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface IWebRTCParticipant {
  id: string;
  userId: string;
  name: string;
  role: string;
  joinedAt: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isScreenSharing: boolean;
  raisedHand: boolean;
}

export interface IRecordingSession {
  id: string;
  classroomId: number;
  startedBy: string;
  status: RecordingStatus;
  startedAt: string;
  endedAt?: string;
  duration?: number;
  fileUrl?: string;
  transcriptUrl?: string;
  participants: string[];
}

export interface IAnalyticsEvent {
  id: string;
  type: string;
  userId: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface IWhiteboardState {
  id: string;
  classroomId: number;
  elements: unknown[];
  backgroundColor: string;
  lastModified: string;
}

export interface IBulkMessage {
  id: string;
  channel: 'whatsapp' | 'sms' | 'email';
  content: string;
  recipients: string[];
  status: 'draft' | 'sent' | 'scheduled' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
}

export interface IMarketingCampaign {
  id: string;
  name: string;
  platforms: string[];
  content: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  budget?: number;
  impressions?: number;
  clicks?: number;
}

import { ClassroomStatus, MessageType, NotificationType, ExamType, CEFRLevel, SubscriptionTier, PaymentStatus, RecordingStatus } from '../enums';
