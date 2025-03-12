var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var path = require('path');
var transcriptionService = require('./main/transcriptionService');
function createWindow() {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // 开发环境下加载本地服务器
    if (process.env.ELECTRON === 'true') {
        win.loadURL('http://localhost:5173');
        // 打开开发工具
        win.webContents.openDevTools();
    }
    else {
        win.loadFile('index.html');
    }
}
app.whenReady().then(function () {
    transcriptionService.init();
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
