const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');

if (isDev) {
    const log = require('electron-log');
    log.transports.file.level = 'debug';
    autoUpdater.logger = log;
    require('electron-reload')(__dirname);
}

/* Chrome cast testing, (all tests complete sucefully! keeping this comment here be the base of chromecast support code)
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
            enableRemoteModule: true,
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

    var avaliableUpdate = false;
    var canUpdate = false;

    autoUpdater.on('checking-for-update', () => {
        win.webContents.send('checkingforupdate');
        setTimeout(() => {
            if (!canUpdate) {
                win.webContents.send('updatenotavailable');
            }
        }, 15000);
    });

    autoUpdater.on('update-available', () => {
        canUpdate = true;
        win.webContents.send('downloadprogress', 0 + '%');
    });

    // eslint-disable-next-line no-unused-vars
    autoUpdater.on('download-progress', (progress, bytesPsecound, percent, total, transferred) => {
        win.webContents.send('downloadprogress', percent.toString() + '%');
    });
    
    autoUpdater.on('update-downloaded', (updateInfo) => {
        avaliableUpdate = true;
        win.webContents.send('updatedownloaded', JSON.stringify(updateInfo));
    });

    ipcMain.on('installupdate', () => {
        if (avaliableUpdate) {
            autoUpdater.quitAndInstall(true, true);
        } else {
            win.webContents.send('updateerror', 'no update to install');
        }
    });
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
    if (!isDev) {
        setInterval(() => {
            autoUpdater.checkForUpdatesAndNotify();
        }, 780000); // 13 minutes
    }
    event.sender.send('app_version', { version: app.getVersion() });
});