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
        if (content.thumb.startsWith('.')) {content.thumb = '../' + content.thumb;}
        content.title = content.title.replace(/<{InsertApostrofuHere}>/g, '\'');
        content.filePath = content.filePath.replace(/<{InsertApostrofuHere}>/g, '\'');
        document.getElementsByClassName('MusicIcon')[0].src = content.thumb;
        document.getElementsByClassName('MediaThumb')[0].src = content.thumb;
        document.getElementsByClassName('title')[0].innerText = content.title;
        document.getElementsByClassName('author')[0].innerText = content.author;
        var audio = new Audio(content.filePath);
        audio.ondurationchange = (value) => {
            document.getElementsByClassName('TotalTime')[0].innerText = getTime(value.path[0].duration);
        };
    });
};

// --[Below code by Lobo Metalurgico]
// github.com/loboMetalurgico
function getTime(Time) {
    let totalSeconds = Math.floor(Time);
    const days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);

    var time;

    if (seconds <= 9) {
        seconds = '0' + seconds.toString();
    }

    if (days >= 1) {
        if (minutes <= 9) {
            minutes = '0' + minutes.toString();
        }
        if (hours <= 9) {
            hours = '0' + hours.toString();
        }
        time = `${days}:${hours}:${minutes}:${seconds}`;
    } else if (hours >= 1) {
        if (minutes <= 9) {
            minutes = '0' + minutes.toString();
        }
        time = `${hours}:${minutes}:${seconds}`;
    } else if (minutes >= 1) {
        time = `${minutes}:${seconds}`;
    } else {
        time = `0:${seconds}`;
    }
    return time;
}