"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
// 暴露安全的API给渲染进程
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    transcribeAudio: function (buffer) { return electron_1.ipcRenderer.invoke('transcribe-audio', buffer); }
});
