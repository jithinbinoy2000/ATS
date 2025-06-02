const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  getStoredFiles: () => ipcRenderer.invoke('get-stored-files'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
});
