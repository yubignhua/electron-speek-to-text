const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  transcribeAudio: (buffer) => ipcRenderer.invoke('transcribe-audio', buffer)
}); 