const ipcRenderer = require('electron').ipcRenderer;

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
}