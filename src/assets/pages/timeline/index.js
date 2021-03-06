window.loadedComplete = () => {
    document.getElementsByClassName('expandPlayerButton')[0].onclick = () => {
        window.timeline.send("timeline.events.expand.fullscreen");
    }

    window.timeline.on('timeline.events.expand.fullscreen.expandend', () => {
        document.getElementsByClassName('timeline')[0].style.opacity = 0;
        document.getElementsByClassName('expandedTimeline')[0].style.display = 'block';
        setTimeout(() => {
            document.getElementsByClassName('timeline')[0].style.display = 'none';
            document.getElementsByClassName('expandedTimeline')[0].style.opacity = 1;
        }, 250)
    })

    document.getElementsByClassName('expandedTimeline')[0].onclick = () => {
        window.timeline.send("timeline.events.expand.small");
    };

    window.timeline.on("timeline.events.expand.small.contract", () => {
        document.getElementsByClassName('timeline')[0].style.display = 'block';
        document.getElementsByClassName('expandedTimeline')[0].style.opacity = 0;
        setTimeout(() => {
            document.getElementsByClassName('expandedTimeline')[0].style.display = 'none';
            document.getElementsByClassName('timeline')[0].style.opacity = 1;
        }, 250)
    });
}