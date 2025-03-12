import { contextBridge, ipcRenderer } from 'electron';

// 为了类型安全，定义接口
interface ElectronAPI {
  transcribeAudio: (buffer: Uint8Array) => Promise<any>;
}

// 暴露安全的API给渲染进程
const api: ElectronAPI = {
  transcribeAudio: (buffer) => ipcRenderer.invoke('transcribe-audio', buffer)
};

// 使用 contextBridge 暴露 API
contextBridge.exposeInMainWorld('electronAPI', api); 