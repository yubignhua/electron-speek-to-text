import { contextBridge, ipcRenderer } from 'electron';

// 为了类型安全，定义接口
interface ElectronAPI {
  transcribeAudio: (buffer: Uint8Array) => Promise<any>;
}

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  transcribeAudio: (buffer: Uint8Array) => ipcRenderer.invoke('transcribe-audio', buffer)
}); 