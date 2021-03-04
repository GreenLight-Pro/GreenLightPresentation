const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
require('electron-reload')(__dirname);

function createWindow () {
  const win = new BrowserWindow({
    width: 900,
    height: 610,
    transparent: true, 
    frame: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  ipcMain.on('maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on('minimize', ()=>{win.minimize()})

  win.webContents.openDevTools();
  win.loadFile('./src/pages/splashScreen/index.html')
  win.removeMenu()
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})