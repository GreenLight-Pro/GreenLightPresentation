/* eslint-disable no-undef */

var isMaximized = false;

window.loadedComplete = () => {
    document.getElementsByClassName('expandPlayerButton')[0].onclick = () => {
        window.timeline.send('timeline.events.expand.fullscreen');
    };

    window.timeline.on('timeline.events.expand.fullscreen.expandend', () => {
        isMaximized = true;
        document.getElementsByTagName('body')[0].style.backgroundColor = '#1a0022';
        document.getElementsByClassName('expandedTimeline')[0].style.display = 'block';
        setTimeout(() => {
            if (!isMaximized) {return;}
            document.getElementsByClassName('expandedTimeline')[0].style.opacity = 1;
        }, 250);
        setTimeout(() => {
            if (!isMaximized) {return;}
            document.getElementsByClassName('timeline')[0].style.opacity = 0;
            document.getElementsByClassName('timeline')[0].style.display = 'none';
        }, 500);
    });

    document.getElementsByClassName('expandedTimelineCloseBar')[0].onclick = () => {
        window.timeline.send('timeline.events.expand.small');
    };

    window.timeline.on('timeline.events.expand.small.contract', () => {
        isMaximized = false;
        document.getElementsByClassName('timeline')[0].style.display = 'block';
        setTimeout(() => {
            if (isMaximized) {return;}
            document.getElementsByClassName('expandedTimeline')[0].style.opacity = 0;
            document.getElementsByClassName('expandedTimeline')[0].style.display = 'none';
            document.getElementsByClassName('timeline')[0].style.opacity = 1;
        }, 250);
        setTimeout(() => {
            if (isMaximized) {return;}
            document.getElementsByTagName('body')[0].style.backgroundColor = '#0000';
        }, 750);
    });

    window.ipcRenderer.on('media.playcontent', (content) => {
        console.log(content);
        if (content.thumb.startsWith('.')) {content.thumb = '../' + content.thumb;}
        document.getElementsByClassName('MusicIcon')[0].src = content.thumb;
        document.getElementsByClassName('MediaThumb')[0].src = content.thumb;
        document.getElementsByClassName('title')[0].innerText = content.title;
    });
};