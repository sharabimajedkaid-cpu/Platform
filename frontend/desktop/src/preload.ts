import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('britishce44', {
  showNotification: (title: string, body: string) => {
    ipcRenderer.send('show-notification', { title, body });
  },
  getAppVersion: (): Promise<string> => {
    return ipcRenderer.invoke('get-app-version');
  },
  onUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on('update-available', callback);
  },
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', callback);
  },
  onDownloadProgress: (callback: (percent: number) => void) => {
    ipcRenderer.on('download-progress', (_event, percent) => callback(percent));
  },
  openExternal: (url: string) => {
    ipcRenderer.invoke('open-external', url);
  },
  platform: process.platform,
});
