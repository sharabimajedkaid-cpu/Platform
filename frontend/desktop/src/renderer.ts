// This file sets up the desktop-specific UI enhancements

interface DesktopAPI {
  showNotification: (title: string, body: string) => void;
  getAppVersion: () => Promise<string>;
  onUpdateAvailable: (callback: () => void) => void;
  onUpdateDownloaded: (callback: () => void) => void;
  onDownloadProgress: (callback: (percent: number) => void) => void;
  openExternal: (url: string) => void;
  platform: string;
}

declare global {
  interface Window {
    britishce44: DesktopAPI;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const api = window.britishce44;
  if (!api) return;

  console.log(`Britishce44 Desktop v${api.platform}`);

  api.onUpdateAvailable(() => {
    if (confirm('A new version is available. Download now?')) {
      // autoUpdater handles download
    }
  });

  api.onUpdateDownloaded(() => {
    if (confirm('Update downloaded. Restart to install?')) {
      // Trigger restart via IPC
    }
  });

  api.getAppVersion().then(version => {
    const versionEl = document.createElement('div');
    versionEl.id = 'desktop-version';
    versionEl.style.cssText = 'position:fixed;bottom:8px;right:12px;font-size:10px;color:#6b7280;z-index:9999;pointer-events:none;';
    versionEl.textContent = `Desktop v${version}`;
    document.body.appendChild(versionEl);
  });

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('a');
    if (link?.href?.startsWith('http') && !link.href.includes(window.location.hostname)) {
      e.preventDefault();
      api.openExternal(link.href);
    }
  });
});

export {};
