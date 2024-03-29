/* eslint-disable no-undef */

var isMaximized = false;
var isAudio = true;
const audio = document.getElementsByClassName('PlayAudioFiles')[0];
const video = document.getElementsByClassName('PlayVideoFiles')[0];
var volumeBefore = 0;
var haveMute = false;

var AltPopupTimeout = setTimeout(()=>{},1);

// AltText
document.onmouseover = (event) => {
    if (isMaximized && event.target && event.target.attributes && event.target.attributes.alt) {
        // eslint-disable-next-line no-inner-declarations
        function adjustPosition() {
            // eslint-disable-next-line max-len
            document.getElementById('AltPopupDiv').style.left = ((event.target.offsetLeft + (event.target.offsetWidth / 2)) - (document.getElementById('AltPopupDiv').offsetWidth / 2)) + 'px';
            var TopOffset = event.target.offsetTop;
            if (TopOffset === 0 && event.target.offsetParent && event.target.offsetParent.offsetTop) {
                TopOffset = event.target.offsetParent.offsetTop;
            }
            // eslint-disable-next-line max-len
            document.getElementById('AltPopupDiv').style.top = (TopOffset - (document.getElementById('AltPopupDiv').offsetHeight + (0.01 * window.innerWidth))) + 'px';
            document.getElementById('AltPopupSpan').innerText = event.target.attributes.alt.value;
            document.getElementById('AltPopupDiv').style.opacity = 1;
        }
        AltPopupTimeout = setTimeout(() => {
            adjustPosition();
            adjustPosition();
        }, 500);
    } else {
        document.onmouseleave();
    }
};

document.onmouseleave = () => {
    clearTimeout(AltPopupTimeout);
    document.getElementById('AltPopupDiv').style.opacity = 0;
};

document.getElementsByClassName('volumeIcon')[0].onclick = () => {
    if (haveMute) {
        audio.volume = volumeBefore;
        video.volume = volumeBefore;
        document.getElementsByClassName('volumeIcon')[0].src = '../../images/soundIcon.png';
        haveMute = false;
        UpdateVolumeHandler();
    } else {
        volumeBefore = audio.volume;
        audio.volume = 0;
        video.volume = 0;
        document.getElementsByClassName('volumeIcon')[0].src = '../../images/noSoundIcon.png';
        document.getElementsByClassName('volumeBarProgressWhiteArea')[0].style.width = '0px';
        haveMute = true;
        UpdateVolumeHandler();
    }
};

function UpdateVolumeHandler() {
    var maxSize = document.getElementsByClassName('volumeBarProgress')[0].offsetWidth;
    var ballSize = document.getElementsByClassName('volumeBarProgressHandler')[0].offsetWidth;
    document.getElementsByClassName('volumeBarProgressWhiteArea')[0].style.width = ((audio.volume * maxSize) - (ballSize / 2)) + 'px';
    document.getElementsByClassName('volumeBarProgressHandler')[0].style.marginLeft = ((audio.volume * maxSize) - (ballSize / 2)) + 'px';
    if (audio.volume > 0) {
        document.getElementsByClassName('volumeIcon')[0].src = '../../images/soundIcon.png';
    } else {
        document.getElementsByClassName('volumeBarProgressWhiteArea')[0].style.width = '0px';
        document.getElementsByClassName('volumeIcon')[0].src = '../../images/noSoundIcon.png';
    }
}

function TimeUpdater(audio) {
    var currentTime = audio.currentTime;
    var fullTime = audio.duration;
    var percentage = ((currentTime / fullTime) * 100).toFixed(3);
    document.getElementsByClassName('currentTime')[0].innerText = getTime(currentTime);
    document.getElementsByClassName('StartedTime')[0].innerText = getTime(currentTime);
    document.getElementsByClassName('progressbarProgress')[0].style.setProperty('--Percentagem', percentage);
    document.getElementsByClassName('ProgressBarField')[0].style.setProperty('--Percentagem', percentage);
}

audio.volume = 1;
video.volume = 1;
haveMute = false;
UpdateVolumeHandler();

var updateActivity = (args) => {
    if (window.ipcRenderer) {
        window.ipcRenderer.send('spinmp.setActivity', args);
    }
};

// eslint-disable-next-line no-unused-vars
function mediaPlayPauseHandler(ignoreChange = false) {
    if (isAudio) {
        if ((!ignoreChange && audio.paused) || (ignoreChange && !audio.paused)) {
            if (!ignoreChange) {audio.play();}
            updateActivity({
                details: document.getElementsByClassName('title')[0].innerText,
                largeImageKey: 'defaultmusicpicture',
                largeImageText: 'Listening to a song',
                smallImageKey: 'playbutton',
                smallImageText: 'Playing',
                state: document.getElementsByClassName('author')[0].innerText,
                startTimestamp: Date.now(),
                endTimestamp: (Date.now() + Number(((audio.duration - audio.currentTime) * 1000).toFixed(0))),
            });
        } else {
            if (!ignoreChange) {audio.pause();}
            updateActivity({
                details: document.getElementsByClassName('title')[0].innerText,
                largeImageKey: 'defaultmusicpicture',
                largeImageText: 'Listening to a song',
                smallImageKey: 'pausebutton',
                smallImageText: 'Paused',
                state: document.getElementsByClassName('author')[0].innerText,
            });
        }
    } else {
        if ((!ignoreChange && video.paused) || (ignoreChange && !video.paused)) {
            if (!ignoreChange) {video.play();}
            updateActivity({
                details: document.getElementsByClassName('title')[0].innerText,
                largeImageKey: audio.localName === 'audio' ? 'defaultmusicpicture' : 'defaultvideopicture',
                largeImageText: audio.localName === 'audio' ? 'Listening to a song' : 'Watching to a video',
                smallImageKey: 'playbutton',
                smallImageText: 'Playing',
                state: document.getElementsByClassName('author')[0].innerText,
                startTimestamp: Date.now(),
                endTimestamp: (Date.now() + Number(((video.duration - video.currentTime) * 1000).toFixed(0))),
            });
        } else {
            if (!ignoreChange) {video.pause();}
            updateActivity({
                details: document.getElementsByClassName('title')[0].innerText,
                largeImageKey: 'defaultvideopicture',
                largeImageText: 'Watching to a video',
                smallImageKey: 'pausebutton',
                smallImageText: 'Paused',
                state: document.getElementsByClassName('author')[0].innerText,
            });
        }
    }
}

function volumeClickPositionHandler(event) {
    if (event.srcElement.className !== 'volumeBarProgress') {return;}
    var clickPosition = event.clientX - event.srcElement.offsetLeft;
    var elementSize = event.srcElement.offsetWidth;
    var percentage = ((clickPosition / elementSize) * 100).toFixed(3);
    if ((percentage / 1000) > 1) {percent = 100;}
    audio.volume = (percentage / 100) - 8;
    video.volume = (percentage / 100) - 8;
    UpdateVolumeHandler();
}

document.getElementsByClassName('volumeBarProgress')[0].onclick = volumeClickPositionHandler;

document.getElementsByClassName('volumeBarProgress')[0].addEventListener('mousedown', function() {
    document.addEventListener('mousemove', volumeClickPositionHandler);
});

function progressBarClickPositionHandler(event) {
    if ((isAudio && audio.readyState <= 2) || (!isAudio && video.readyState <= 2)) {return;}
    var clickPosition = event.clientX - event.srcElement.offsetLeft;
    var elementSize = event.srcElement.offsetWidth;
    var percentage = ((clickPosition / elementSize) * 100).toFixed(3);
    var currentTime = 0;
    var fullTime = 0;
    if (isAudio) {
        currentTime = audio.currentTime;
        fullTime = audio.duration;
    } else {
        currentTime = video.currentTime;
        fullTime = video.duration;
    }
    if (!(isNaN(currentTime) && isNaN(fullTime))) {
        if (isAudio) {
            audio.currentTime = (percentage / 100) * fullTime;
        } else {
            video.currentTime = (percentage / 100) * fullTime;
        }
        mediaPlayPauseHandler(true);
    }
}

document.getElementsByClassName('ProgressBarArea')[0].onclick = progressBarClickPositionHandler;
document.getElementsByClassName('progressbar')[0].onclick = progressBarClickPositionHandler;

document.getElementsByClassName('ProgressBarArea')[0].addEventListener('mousedown', function() {
    document.addEventListener('mousemove', progressBarClickPositionHandler);
});
document.getElementsByClassName('progressbar')[0].addEventListener('mousedown', function() {
    document.addEventListener('mousemove', progressBarClickPositionHandler);
});
document.addEventListener('mouseup', function() {
    document.removeEventListener('mousemove', progressBarClickPositionHandler);
    document.removeEventListener('mousemove', volumeClickPositionHandler);
});

window.loadedComplete = () => {
    const path = window.require('path');

    window.ipcRenderer.on('spinmp.timeline.pausePlay', () => {mediaPlayPauseHandler();});

    function PlayMedia(audio, content, picture) {
        audio.src = content.filePath;
        audio.onplay = () => {
            document.getElementById('playbutton').children[0].src = '../../images/pausebutton.png';
            document.getElementById('Eplaybutton').children[0].src = '../../images/pausebutton.png';
        };
        audio.onpause = () => {
            document.getElementById('playbutton').children[0].src = '../../images/playbutton.png';
            document.getElementById('Eplaybutton').children[0].src = '../../images/playbutton.png';
        };
        audio.onloadeddata = (event) => {
            audio.play().then(() => {
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: content.title + (content.author !== 'No author' ? (' - ' + content.author) : ''),
                        artist: 'Spin Music Player',
                        album: 'No album',
                        artwork: [
                            // eslint-disable-next-line max-len
                            { src: picture, sizes: '512x512', type: ('image/' + getExtName(picture).slice(1)) },
                        ]
                    });
                }
                  
                navigator.mediaSession.setActionHandler('play', function() {
                    audio.play();
                });
                navigator.mediaSession.setActionHandler('pause', function() {
                    audio.pause();
                });
            });
            var duration = getTime(event.path[0].duration);
            document.getElementsByClassName('TotalTime')[0].innerText = duration;
            document.getElementsByClassName('FinishTime')[0].innerText = duration;
            updateActivity({
                details: content.title,
                largeImageKey: audio.localName === 'audio' ? 'defaultmusicpicture' : 'defaultvideopicture',
                largeImageText: audio.localName === 'audio' ? 'Listening to a song' : 'Watching to a video',
                smallImageKey: 'playbutton',
                smallImageText: 'Playing',
                state: content.author,
                startTimestamp: Date.now(),
                endTimestamp: (Date.now() + Number((event.path[0].duration * 1000).toFixed(0))),
            });
        };
    }

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

        if (!isAudio) {
            document.getElementsByClassName('PlayVideoFiles')[0].style.display = 'block';
        }
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

        document.getElementsByClassName('PlayVideoFiles')[0].style.display = 'none';
    });

    window.ipcRenderer.on('media.playcontent', (content) => {
        var picture = content.thumb;
        if (picture.startsWith('../')) {
            var uri = path.resolve(window.__dirname, content.thumb);
            toDataURL(uri, (data) => {
                picture = data;
                proceed();
            }, 'png');
        } else {
            proceed();
        }
        function proceed() {
            content.title = content.title.replace(/<{InsertApostrofuHere}>/g, '\'');
            content.filePath = content.filePath.replace(/<{InsertApostrofuHere}>/g, '\'');
            document.getElementsByClassName('MusicIcon')[0].src = picture;
            document.getElementsByClassName('MediaThumb')[0].src = picture;
            document.getElementsByClassName('title')[0].innerText = content.title;
            document.getElementsByClassName('author')[0].innerText = content.author;
            if (content.type === 'audio') {
                isAudio = true;
                video.pause();
                video.src = '';
                document.getElementsByClassName('PlayVideoFiles')[0].style.display = 'none';
                PlayMedia(audio, content, picture);
            } else {
                isAudio = false;
                audio.pause();
                audio.src = '';

                PlayMedia(video, content, picture);
            }
        }
    });

    audio.ontimeupdate = () => {TimeUpdater(audio);};
    video.ontimeupdate = () => {TimeUpdater(video);};
};

function getExtName(fileName) {
    var file = fileName.toString();
    var lastDotIndex = file.lastIndexOf('.');
    var ext = file.slice(lastDotIndex);
    return ext;
}

// https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
function toDataURL(src, callback, outputFormat) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        img.src = src;
    }
}

// --[Below code by Lobo Metalurgico]
// https://www.github.com/loboMetalurgico
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