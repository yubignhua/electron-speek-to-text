const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  transcribeAudio: (buffer: Uint8Array) => ipcRenderer.invoke('transcribe-audio', buffer)
}); 