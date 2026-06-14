export interface ClassroomChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface ClassroomSnapshot {
  messages: ClassroomChatMessage[];
  attendance: Record<string, boolean>;
  roomLocked: boolean;
}

const STORAGE_PREFIX = 'b44_classroom';

function getStorageKey(roomId: number) {
  return `${STORAGE_PREFIX}:${roomId}`;
}

export function loadClassroomSnapshot(roomId: number): ClassroomSnapshot {
  if (typeof window === 'undefined') {
    return { messages: [], attendance: {}, roomLocked: false };
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(roomId));
    if (!raw) {
      return { messages: [], attendance: {}, roomLocked: false };
    }

    const parsed = JSON.parse(raw) as Partial<ClassroomSnapshot>;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      attendance: parsed.attendance && typeof parsed.attendance === 'object' ? parsed.attendance : {},
      roomLocked: Boolean(parsed.roomLocked),
    };
  } catch {
    return { messages: [], attendance: {}, roomLocked: false };
  }
}

export function saveClassroomSnapshot(roomId: number, snapshot: Partial<ClassroomSnapshot>) {
  if (typeof window === 'undefined') return;

  try {
    const current = loadClassroomSnapshot(roomId);
    const next = {
      ...current,
      ...snapshot,
    };
    window.localStorage.setItem(getStorageKey(roomId), JSON.stringify(next));
  } catch {
    // Ignore local storage failures so classroom interaction still works.
  }
}
