// public/electron/routes/ipcRoutes.js
const { ipcMain } = require('electron');
const { handleSelectFolder } = require('../controllers/folderController');
const { handleSelectFiles, handleGetStoredFiles } = require('../controllers/fileController');
const { handleScanFiles } = require('../controllers/scanController');

function registerIpcHandlers() {
  ipcMain.handle('select-folder', handleSelectFolder);
  ipcMain.handle('select-files', handleSelectFiles);
  ipcMain.handle('get-stored-files', handleGetStoredFiles);
   ipcMain.handle('scan-files', handleScanFiles);
}

module.exports = { registerIpcHandlers };
