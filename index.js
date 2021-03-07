const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, ipcMain, dialog } = electron;
const { autoUpdater } = require('electron-updater');

const log = require('electron-log');
log.transports.file.level = 'debug';
autoUpdater.logger = log;

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
    });
});

autoUpdater.on('error', message => {
    console.error('There was a problem updating the application');
    console.error(message);
});

// require('electron-reload')(__dirname);

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
    ipcMain.on('minimize', ()=>{win.minimize();});

    win.webContents.openDevTools();
    win.loadFile('./src/pages/splashScreen/index.html');
    win.removeMenu();

    win.setThumbarButtons([{
        tooltip: 'previous',
        icon: path.resolve(__dirname, 'src', 'assets', 'images','previousbutton.png'),
        flags: ['disabled'],
        click () { console.log('button0 clicked.'); }
    }, {
        tooltip: 'Play',
        icon: path.resolve(__dirname, 'src', 'assets', 'images','playbutton.png'),
        flags: ['disabled'],
        click () { console.log('button1 clicked'); }
    }, {
        tooltip: 'next',
        icon: path.resolve(__dirname, 'src', 'assets', 'images','nextbutton.png'),
        flags: ['disabled'],
        click () { console.log('button2 clicked.'); }
    }]);

    /* win.setOverlayIcon(path.resolve(__dirname, 'src', 'assets', 'images','previousbutton.png'), 'Description for overlay')

  win.flashFrame(true)*/
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    setInterval(() => {
        autoUpdater.checkForUpdatesAndNotify();
    }, 10000);
    event.sender.send('app_version', { version: app.getVersion() });
});