const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const mainWindow = new BrowserWindow({
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
}

// Cache path
const SECRET_PATH = path.join(os.homedir(), '.ats_secret_files.json');
const CACHE_DIR = path.join(os.homedir(), '.ats_file_cache');

//Helper
function cacheFile(originalPath) {
  const ext = path.extname(originalPath);
  const base = path.basename(originalPath, ext);
  const uniqueName = `${base}_${Date.now()}${ext}`;
  const cachedPath = path.join(CACHE_DIR, uniqueName);
  //copy
  fs.copyFileSync(originalPath, cachedPath);

  return cachedPath;
}



if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}


// Handle folder selection & save PDF/DOC files
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
   properties: ['openDirectory', 'openFile', 'multiSelections'],

  });

  if (result.canceled || result.filePaths.length === 0) return [];

  const folderPath = result.filePaths[0];

  // Filter only PDF and DOC/DOCX files
 const files = fs.readdirSync(folderPath)
  .filter(file => ['.pdf', '.doc', '.docx'].includes(path.extname(file).toLowerCase()))
  .map((file) => {
    const fullPath = path.join(folderPath, file);
    const cachedPath = cacheFile(fullPath);

    return {
      name: file,
      path: cachedPath,
      originalPath: fullPath,
      ext: path.extname(file).toLowerCase(),
    };
  });


  // Save to secret file for later reference
  fs.writeFileSync(SECRET_PATH, JSON.stringify(files, null, 2));

  return files;
});
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] },
    ],
  });

  if (result.canceled || result.filePaths.length === 0) return [];

  const files = result.filePaths.map((filePath) => {
    const cachedPath = cacheFile(filePath);
    return {
      name: path.basename(filePath),
      path: cachedPath,
      originalPath: filePath,
      ext: path.extname(filePath).toLowerCase(),
    };
  });

  // Append to secret file
  let existing = [];
  if (fs.existsSync(SECRET_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(SECRET_PATH));
    } catch {}
  }

  const updated = [...existing, ...files];
  fs.writeFileSync(SECRET_PATH, JSON.stringify(updated, null, 2));

  return files;
});



// Read stored files
ipcMain.handle('get-stored-files', async () => {
  if (!fs.existsSync(SECRET_PATH)) return [];
  const data = fs.readFileSync(SECRET_PATH);
  return JSON.parse(data);
});

//  App Boot
app.whenReady().then(createWindow);

// Clean exit on all windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
