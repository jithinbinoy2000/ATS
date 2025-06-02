//public\electron\electron.js
const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { registerIpcHandlers } = require('./routes/ipcRoutes');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');

  // Intercept close event to show warning dialog
  mainWindow.on('close', (e) => {
    // Show warning dialog synchronously
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'warning',
      buttons: ['Quit Anyway', 'Cancel'],
      defaultId: 1,
      cancelId: 1,
      title: 'Confirm Quit',
      message: 'You have ongoing processes. If you quit now, all processed data may be lost. Are you sure you want to exit?',
      noLink: true,
    });

    if (choice === 1) {
      // User clicked 'Cancel' — prevent window from closing
      e.preventDefault();
    }
    // else allow quit
  });
}

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
