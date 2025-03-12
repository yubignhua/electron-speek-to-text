import { app, BrowserWindow } from 'electron'
import path from 'path'

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')
  
  // 打开开发者工具（可选）
  // mainWindow.webContents.openDevTools()
}

// 当 Electron 完成初始化时被调用
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 当所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 