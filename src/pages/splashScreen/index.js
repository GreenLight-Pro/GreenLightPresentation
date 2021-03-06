const ipcRenderer = require('electron').ipcRenderer;

var isMaximized = false; 

function maximizer() {
    var returner = ipcRenderer.sendSync("synchronous-message", 'maximize');
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
    if (((maxFrames / 100) * currentFrame)/100 > 90) {
        timebetweenFrames += currentFrame;
    }
    if (Number(document.getElementsByClassName('progressBar')[0].style.width.split('vw')[0]) >= 100) {
        console.log('loaded!');
        setTimeout(() => {
            document.getElementsByClassName('content')[0].className = 'exitingContent';
            setTimeout(() => {
                onLoaded();
            }, 500)
        }, timebetweenFrames);
        return;
    }
    document.getElementsByClassName('progressBar')[0].style.width = ((maxFrames / 100) * currentFrame)/100 + 'vw';
    setTimeout(() => {
        animationFrame();
    }, timebetweenFrames)
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
    document.getElementsByClassName('ActivePage')[0].style.height = 'calc(100vh - 0.5vw)';
    document.getElementsByClassName('timeline')[0].style.height = '100vh';
    timeline.send('timeline.events.expand.fullscreen.expandend');
    if (isMaximized) {
        document.getElementsByClassName('timeline')[0].style.borderBottomLeftRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderBottomRightRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderTopRightRadius = '0vw';
        document.getElementsByClassName('timeline')[0].style.borderTopLeftRadius = '0vw';
        document.getElementsByClassName('ActivePage')[0].style.borderBottomRightRadius = '0vw';
        document.getElementsByClassName('ActivePage')[0].style.borderBottomLeftRadius = '0vw';
    } else {
        document.getElementsByClassName('timeline')[0].style.borderBottomLeftRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderBottomRightRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderTopRightRadius = '1vw';
        document.getElementsByClassName('timeline')[0].style.borderTopLeftRadius = '1vw';
        document.getElementsByClassName('ActivePage')[0].style.borderBottomRightRadius = '1vw';
        document.getElementsByClassName('ActivePage')[0].style.borderBottomLeftRadius = '1vw';
    }
});

timeline.on('timeline.events.expand.small', () => {
    document.getElementsByClassName('ActivePage')[0].style.borderBottomRightRadius = '0vw';
    document.getElementsByClassName('ActivePage')[0].style.borderBottomLeftRadius = '0vw';
    document.getElementsByClassName('ActivePage')[0].style.height = 'calc(100vh - 4vw)';
    document.getElementsByClassName('timeline')[0].style.height = '5vw';
    timeline.send('timeline.events.expand.small.contract');
});

document.getElementsByClassName('timeline')[0].onload = function () {
    const iframeWin = document.getElementsByClassName('timeline')[0].contentWindow;
    iframeWin.require = require;
    iframeWin.timeline = timeline;
    iframeWin.loadedComplete();
};

ipcRenderer.send('app_version');
ipcRenderer.on('app_version', (event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    console.log('Version: ' + arg.version);
});
