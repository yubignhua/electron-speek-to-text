import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  transcribeAudio: (buffer: Buffer) => ipcRenderer.invoke('transcribe-audio', buffer)
}); 