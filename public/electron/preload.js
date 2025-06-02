//public\electron\preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  scanFiles: (files) => ipcRenderer.invoke('scan-files', files),
  onScanProgress: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('scan-progress', listener);
    return () => ipcRenderer.removeListener('scan-progress', listener);
  },
  onScanData: (callback) => {
    const listener = (_event, data) => callback(data);
    ipcRenderer.on('scan-data', listener);
    return () => ipcRenderer.removeListener('scan-data', listener);
  },
});
