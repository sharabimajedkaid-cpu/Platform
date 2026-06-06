import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineQueueItem {
  id: string;
  type: string;
  payload: any;
  timestamp: string;
  retries: number;
}

export class OfflineSyncService {
  private queue: OfflineQueueItem[] = [];
  private readonly storageKey = 'b44_offline_queue';
  private isSyncing = false;

  async initialize(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (stored) this.queue = JSON.parse(stored);
    } catch { this.queue = []; }
  }

  async enqueue(type: string, payload: any): Promise<void> {
    const item: OfflineQueueItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type, payload, timestamp: new Date().toISOString(), retries: 0,
    };
    this.queue.push(item);
    await this.persist();
  }

  async sync(): Promise<void> {
    if (this.isSyncing || this.queue.length === 0) return;
    this.isSyncing = true;

    const remaining: OfflineQueueItem[] = [];
    for (const item of this.queue) {
      try {
        const response = await fetch(`https://api.britishce44.edu/api/v1/sync/${item.type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });
        if (!response.ok) throw new Error(`Sync failed: ${response.status}`);
      } catch (err) {
        item.retries++;
        if (item.retries < 5) remaining.push(item);
      }
    }
    this.queue = remaining;
    await this.persist();
    this.isSyncing = false;
  }

  async getQueueLength(): Promise<number> {
    return this.queue.length;
  }

  private async persist(): Promise<void> {
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.queue));
  }

  async clear(): Promise<void> {
    this.queue = [];
    await AsyncStorage.removeItem(this.storageKey);
  }
}

export const offlineSync = new OfflineSyncService();
