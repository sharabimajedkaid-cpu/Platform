import { app, BrowserWindow, Menu, Tray, ipcMain, shell, Notification, screen } from 'electron';
import * as path from 'path';
import { autoUpdater } from 'electron-updater';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const WEBAPP_URL = isDev ? 'http://localhost:3000' : 'https://app.britishce44.edu';

function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1400, width),
    height: Math.min(900, height),
    minWidth: 1024,
    minHeight: 600,
    title: 'Britishce44',
    icon: path.join(__dirname, '../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
    backgroundColor: '#0a1628',
  });

  mainWindow.loadURL(WEBAPP_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (!isDev) autoUpdater.checkForUpdates();
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Britishce44',
      submenu: [
        { label: 'About Britishce44', role: 'about' },
        { type: 'separator' },
        { label: 'Check for Updates', click: () => autoUpdater.checkForUpdates() },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' }, { role: 'forceReload' },
        { type: 'separator' },
        { role: 'zoomIn' }, { role: 'zoomOut' }, { role: 'resetZoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' }, { role: 'close' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Britishce44 Support', click: () => shell.openExternal('https://britishce44.edu/support') },
        { label: 'Report Issue', click: () => shell.openExternal('https://github.com/britishce44-create/britishce44-platform/issues') },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createTray(): void {
  // Tray icon for background notifications
}

app.whenReady().then(() => {
  createMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('show-notification', (_event, { title, body }: { title: string; body: string }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
  }
});

ipcMain.handle('get-app-version', () => app.getVersion());

autoUpdater.on('update-available', () => {
  mainWindow?.webContents.send('update-available');
});

autoUpdater.on('download-progress', (progress) => {
  mainWindow?.webContents.send('download-progress', progress.percent);
});

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('update-downloaded');
});
