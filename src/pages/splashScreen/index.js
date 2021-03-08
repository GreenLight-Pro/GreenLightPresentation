/* eslint-disable no-undef */
const ipcRenderer = require('electron').ipcRenderer;

var isMaximized = false; 

// eslint-disable-next-line no-unused-vars
function maximizer() {
    var returner = ipcRenderer.sendSync('synchronous-message', 'maximize');
    if (returner === 'screen.events.maximize.contract') {
        isMaximized = false;
        document.getElementsByClassName('timeline')[0].style.borderBottomLeftRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderBottomRightRadius = '1vw';
        document.getElementsByClassName('dragableBar')[0].style.borderTopRightRadius = '1vw';
        document.getElementsByClassName('dragableBar')[0].style.borderTopLeftRadius = '1vw';
    } else if (returner === 'screen.events.maximize.fullscreen') {
        isMaximized = true;
        document.getElementsByClassName('timeline')[0].style.borderBottomLeftRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderBottomRightRadius = '0vw';
        document.getElementsByClassName('dragableBar')[0].style.borderTopRightRadius = '0vw';
        document.getElementsByClassName('dragableBar')[0].style.borderTopLeftRadius = '0vw';
    }
}

const maxFrames = 10000;
var timebetweenFrames = 1;
var currentFrame = 0;

function animationFrame() {
    currentFrame += 1;
    if (((maxFrames / 100) * currentFrame) / 100 > 90) {
        timebetweenFrames += currentFrame;
    }
    if (Number(document.getElementsByClassName('progressBar')[0].style.width.split('vw')[0]) >= 100) {
        console.log('loaded!');
        setTimeout(() => {
            document.getElementsByClassName('content')[0].className = 'exitingContent';
            setTimeout(() => {
                onLoaded();
            }, 500);
        }, timebetweenFrames);
        return;
    }
    document.getElementsByClassName('progressBar')[0].style.width = ((maxFrames / 100) * currentFrame) / 100 + 'vw';
    setTimeout(() => {
        animationFrame();
    }, timebetweenFrames);
}

animationFrame();

function onLoaded() {
    document.getElementsByClassName('ActivePage')[0].style.display = 'block';
    document.getElementsByClassName('ActivePage')[0].style.opacity = '1';
    document.getElementsByClassName('timeline')[0].style.display = 'block';
    document.getElementsByClassName('timeline')[0].style.opacity = '1';
}

const eventEmmiter = require('events');

class timelineHandler extends eventEmmiter{
    constructor() {
        super();
    }
    send(event, value) {
        this.emit(event, value);
    }
}

const timeline = new timelineHandler();

timeline.on('timeline.events.expand.fullscreen', () => {
    setTimeout(() => {
        document.getElementsByClassName('ActivePage')[0].style.opacity = '0';
    }, 500);
    document.getElementsByClassName('timeline')[0].style.height = '100vh';
    document.getElementsByClassName('blankfieldpainter')[0].style.visibility = 'hidden';
    timeline.send('timeline.events.expand.fullscreen.expandend');
    if (isMaximized) {
        document.getElementsByClassName('timeline')[0].style.borderBottomLeftRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderBottomRightRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderTopRightRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderTopLeftRadius = '0vw';
    } else {
        document.getElementsByClassName('timeline')[0].style.borderBottomLeftRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderBottomRightRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderTopRightRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderTopLeftRadius = '1vw';
    }
});

timeline.on('timeline.events.expand.small', () => {
    document.getElementsByClassName('blankfieldpainter')[0].style.visibility = 'visible';
    document.getElementsByClassName('ActivePage')[0].style.opacity = '1';
    document.getElementsByClassName('timeline')[0].style.height = '5vw';
    timeline.send('timeline.events.expand.small.contract');
});

document.getElementsByClassName('timeline')[0].onload = function () {
    const iframeWin = document.getElementsByClassName('timeline')[0].contentWindow;
    iframeWin.require = require;
    iframeWin.timeline = timeline;
    iframeWin.loadedComplete();
};

document.getElementsByClassName('ActivePage')[0].onload = function () {
    const iframeWin = document.getElementsByClassName('ActivePage')[0].contentWindow;
    iframeWin.require = require;
    iframeWin.timeline = timeline;
    iframeWin.path = require('path');
    const {dialog} = require('electron').remote;
    iframeWin.dialog = dialog;
    iframeWin.loadedComplete();
};

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    console.log('Version: ' + arg.version);
});

// miniNotificationTray

function updateMiniTray() {
    [...document.getElementsByClassName('traybar')[0].children].forEach((child, index) => {
        child.style.zIndex = (-10) - index;
    });
}

updateMiniTray();

ipcRenderer.on('checkingforupdate', () => {
    var doc = document.getElementsByClassName('traybar')[0];
    for (var i = 0; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].className == 'smallUpdate') {
            doc.childNodes[i].style.display = 'block';
            doc.childNodes[i].style.cursor = 'default';
            doc.childNodes[i].style.backgroundColor = '#5b108d';
            doc.childNodes[i].style.width = '20vw';
            doc.childNodes[i].onclick = () => {};
            var doc2 = doc.childNodes[i];
            for (var j = 0; j < doc2.childNodes.length; j++) {
                if (doc2.childNodes[j].className == 'title') {
                    doc2.childNodes[j].innerText = 'Searching for updates';
                    // Updates the icon <--
                    break;
                }        
            }
            updateMiniTray();
            break;
        }        
    }
});

ipcRenderer.on('updatenotavailable', () => {
    var doc = document.getElementsByClassName('traybar')[0];
    for (var i = 0; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].className == 'smallUpdate') {
            doc.childNodes[i].style.opacity = '0';
            doc.childNodes[i].style.backgroundColor = '#5b108d';
            doc.childNodes[i].style.width = '25vw';
            doc.childNodes[i].onclick = () => {};
            setTimeout(() => {
                doc.childNodes[i].style.display = 'none';
                doc.childNodes[i].style.opacity = '1';
            }, 250);
            updateMiniTray();
            break;
        }        
    }
});

ipcRenderer.on('downloadprogress', (percentage) => {
    var doc = document.getElementsByClassName('traybar')[0];
    for (var i = 0; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].className == 'smallUpdate') {
            doc.childNodes[i].style.display = 'block';
            doc.childNodes[i].style.cursor = 'default';
            doc.childNodes[i].style.backgroundColor = '#5b108d';
            doc.childNodes[i].style.width = '25vw';
            doc.childNodes[i].onclick = () => {};
            var doc2 = doc.childNodes[i];
            for (var j = 0; j < doc2.childNodes.length; j++) {
                if (doc2.childNodes[j].className == 'title') {
                    doc2.childNodes[j].innerText = 'Downloading update: ' + percentage;
                    // Updates the icon <--
                    break;
                }        
            }
            updateMiniTray();
            break;
        }        
    }
});

ipcRenderer.on('updatedownloaded', () => {
    var doc = document.getElementsByClassName('traybar')[0];
    for (var i = 0; i < doc.childNodes.length; i++) {
        if (doc.childNodes[i].className == 'smallUpdate') {
            doc.childNodes[i].style.display = 'block';
            doc.childNodes[i].style.cursor = 'pointer';
            doc.childNodes[i].style.width = '18vw';
            var blink1 = setInterval(() => {
                doc.childNodes[i].style.backgroundColor = '#fe721e';
            }, 500);
            var blink2 = setInterval(() => {
                doc.childNodes[i].style.backgroundColor = '#5b108d';
            }, 1000);
            doc.childNodes[i].onclick = () => {
                ipcRenderer.send('installupdate');
            };
            setTimeout(() => {
                clearInterval(blink1);
                clearInterval(blink2);
                doc.childNodes[i].style.backgroundColor = '#fe721e';
            }, 5000);
            var doc2 = doc.childNodes[i];
            for (var j = 0; j < doc2.childNodes.length; j++) {
                if (doc2.childNodes[j].className == 'title') {
                    doc2.childNodes[j].innerText = 'Update avaliable!';
                    // Updates the icon <--
                    break;
                }        
            }
            updateMiniTray();
            break;
        }        
    }
});
