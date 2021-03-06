const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
require('electron-reload')(__dirname);
const { autoUpdater } = require('electron-updater');

/*
const ChromecastAPI = require('chromecast-api')
 
const client = new ChromecastAPI()
 
client.on('device', function (device) {
  console.log("ABOBORA!");
  var mediaURL = 'https://www.youtube.com/watch?v=D0hQI6MW0jc';
 
  device.play(mediaURL, function (err) {
    if (!err) console.log('Playing in your chromecast')
  })
})
*/
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
    },
    icon: path.resolve(__dirname, 'src', 'assets', 'images','logo.png'),
    title: 'Spin Music Player',
  });

  ipcMain.on('synchronous-message', (event, args) => {
    if (args !== 'maximize') {return;}
    if (win.isMaximized()) {
      win.unmaximize();
      event.returnValue = 'screen.events.maximize.contract';
    } else {
      win.maximize();
      event.returnValue = 'screen.events.maximize.fullscreen';
    }
  });
  ipcMain.on('minimize', ()=>{win.minimize()})

  win.webContents.openDevTools();
  win.loadFile('./src/pages/splashScreen/index.html')
  win.removeMenu()

  win.setThumbarButtons([{
      tooltip: 'previous',
      icon: path.resolve(__dirname, 'src', 'assets', 'images','previousbutton.png'),
      flags: ['disabled'],
      click () { console.log('button0 clicked.') }
    }, {
      tooltip: 'Play',
      icon: path.resolve(__dirname, 'src', 'assets', 'images','playbutton.png'),
      flags: ['disabled'],
      click () { console.log('button1 clicked') }
    }, {
      tooltip: 'next',
      icon: path.resolve(__dirname, 'src', 'assets', 'images','nextbutton.png'),
      flags: ['disabled'],
      click () { console.log('button2 clicked.') }
    }]);

  /*win.setOverlayIcon(path.resolve(__dirname, 'src', 'assets', 'images','previousbutton.png'), 'Description for overlay')

  win.flashFrame(true)*/

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  autoUpdater.on('update-available', () => {
    win.webContents.send('update_available');
  });
  
  autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update_downloaded');
  });
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

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});