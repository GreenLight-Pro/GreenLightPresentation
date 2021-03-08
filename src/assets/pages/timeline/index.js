/* eslint-disable no-undef */

window.loadedComplete = () => {
    document.getElementsByClassName('expandPlayerButton')[0].onclick = () => {
        window.timeline.send('timeline.events.expand.fullscreen');
    };

    window.timeline.on('timeline.events.expand.fullscreen.expandend', () => {
        document.getElementsByTagName('body')[0].style.backgroundColor = '#1a0022';
        document.getElementsByClassName('expandedTimeline')[0].style.display = 'block';
        setTimeout(() => {
            document.getElementsByClassName('expandedTimeline')[0].style.opacity = 1;
        }, 250);
        setTimeout(() => {
            document.getElementsByClassName('timeline')[0].style.opacity = 0;
            document.getElementsByClassName('timeline')[0].style.display = 'none';
        }, 500);
    });

    document.getElementsByClassName('expandedTimeline')[0].onclick = () => {
        window.timeline.send('timeline.events.expand.small');
    };

    window.timeline.on('timeline.events.expand.small.contract', () => {
        document.getElementsByClassName('timeline')[0].style.display = 'block';
        setTimeout(() => {
            document.getElementsByClassName('expandedTimeline')[0].style.opacity = 0;
            document.getElementsByClassName('expandedTimeline')[0].style.display = 'none';
            document.getElementsByClassName('timeline')[0].style.opacity = 1;
        }, 250);
        setTimeout(() => {
            document.getElementsByTagName('body')[0].style.backgroundColor = '#0000';
        }, 750);
    });
};