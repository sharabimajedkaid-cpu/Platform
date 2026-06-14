export enum UserRole {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export enum ClassroomStatus {
  ACTIVE = 'active',
  AVAILABLE = 'available',
  UPCOMING = 'upcoming',
  ARCHIVED = 'archived',
}

export enum ExamType {
  QUIZ1 = 'Quiz1_ReadingListeningWriting',
  QUIZ2 = 'Quiz2_GrammarVocabSpeakingWriting',
  SPEAKING = 'Speaking_ListeningDescription',
  FINAL = 'Final_AllSections',
}

export enum CEFRLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum MessageType {
  TEXT = 'text',
  VOICE = 'voice',
  VIDEO = 'video',
  FILE = 'file',
  IMAGE = 'image',
}

export enum NotificationType {
  SYSTEM = 'system',
  CLASSROOM = 'classroom',
  EXAM = 'exam',
  HOMEWORK = 'homework',
  MESSAGE = 'message',
  REPORT = 'report',
}

export enum SubscriptionTier {
  LITE = 'lite',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
  SCREEN = 'screen',
  WHITEBOARD = 'whiteboard',
}

export enum RecordingStatus {
  RECORDING = 'recording',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  PROCESSING = 'processing',
  FAILED = 'failed',
}
