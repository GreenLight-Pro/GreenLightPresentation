/* eslint-disable no-undef, no-unused-vars */

var selectFolder = () => {};
var itemViewerButtonsFunctions = [];

window.loadedComplete = () => {
    console.log('ActivePage javascript loaded!');
    updateFoldersList();

    selectFolder = () => {
        window.dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(results => {
            if (results.canceled) {return;}
            var folderToAdd = results.filePaths[0];
            folderToAdd = folderToAdd.replace(/,/g, 'SData-SemilyCollomI');

            var currentFolders = localStorage.getItem('mediaFolders');
            if (currentFolders) {
                var folders = currentFolders.split(',');
                if (!folders.includes(folderToAdd)) {
                    currentFolders += ',' + folderToAdd;
                }
            } else {
                currentFolders = folderToAdd;
            }
            localStorage.setItem('mediaFolders', currentFolders);
            updateFoldersList();
        });
    };

};

function updateFoldersList() {
    [...document.getElementsByClassName('AddedFolder')].forEach((element) => {
        element.outerHTML = '';
    });
    if (localStorage.getItem('mediaFolders') === '') {return;}
    var folders = localStorage.getItem('mediaFolders').split(',');
    var treadtedFolders = [];
    folders.forEach(Path => {treadtedFolders.push(Path.replace(/SData-SemilyCollomI/g, ','));});
    itemViewerButtonsFunctions = [];
    treadtedFolders.forEach((Folder, index) => {
        var icon = '../../assets/images/';
        var item = {
            icon: icon,
            name: Folder.split('\\')[Folder.split('\\').length - 1],
            smallDesc: Folder,
            description: 'A folder than contains media files than you added to your media folders list',
            buttons: [
                {
                    name: 'deleteFolder',
                    text: 'Remove folder',
                    // eslint-disable-next-line max-len
                    onclick: 'var NewFolders = `' + folders + '`.toString().split(`,`).filter((value,index) => index !== ' + index + ');localStorage.setItem(`mediaFolders`, NewFolders);updateFoldersList();dimissItemViewer(200);',
                    oncLickIndex: index,
                }
            ]
        };
        itemViewerButtonsFunctions.push(item);
        // eslint-disable-next-line max-len, quotes
        document.getElementsByClassName('folders')[0].innerHTML += '<button class="AddedFolder" onclick="createItemViewer(' + JSON.stringify(item).replace(/"/g, "'") + ')"><img class="Icon" src="' + icon + '"></img><span class="subtext">' + Folder + '</span></button>';

    });
}

document.getElementsByClassName('contentBlocker')[0].onclick = dimissItemViewer;
function dimissItemViewer(e) {
    if (e === 'DimissButton' || (e && e.target && e.target.className && e.target.className === 'contentBlocker') || e === 200) {
        document.getElementsByClassName('contentBlocker')[0].style.opacity = 0;
        setTimeout(() => {
            document.getElementsByClassName('contentBlocker')[0].style.display = 'none';
        }, 500);
    }
}

function createItemViewer(item) {
    if (typeof(item) === 'string') {
        item = JSON.parse(item.replace(/'/g, '"'));
    }
    document.getElementsByClassName('itemViewerIcon')[0].src = item.icon;
    document.getElementsByClassName('itemViewerTitle')[0].innerText = item.name;
    document.getElementsByClassName('itemViewerSubTitle')[0].innerText = item.smallDesc;
    document.getElementsByClassName('itemViewerDescription')[0].innerText = item.description;
    document.getElementsByClassName('itemViewerButtonsArea')[0].innerHTML = '<button class="dimiss" onclick="dimissItemViewer(`DimissButton`);">Dimiss</button>';
    item.buttons.forEach((buttonInfo, indexo) => {
        console.log(buttonInfo);
        console.log(itemViewerButtonsFunctions[buttonInfo.oncLickIndex]);
        // eslint-disable-next-line max-len
        document.getElementsByClassName('itemViewerButtonsArea')[0].innerHTML += '<button class="' + buttonInfo.name + '" onclick="' + itemViewerButtonsFunctions[buttonInfo.oncLickIndex].buttons[indexo].onclick + '">' + buttonInfo.text + '</button>';
    });
    document.getElementsByClassName('contentBlocker')[0].style.display = 'block';
    document.getElementsByClassName('contentBlocker')[0].style.opacity = 1;
}