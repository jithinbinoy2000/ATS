const { app, BrowserWindow } = require('electron');
const path = require('path'); // 🔧 You were missing this

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
    },
  });

  // Load React app running in dev server
  mainWindow.loadURL('http://localhost:3000'); // ✅ Loads React into Electron window
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
