const defaultVideoPicture = '../../assets/images/defaultVideoPicture.png';
const defaultMusicPicture = '../../assets/images/defaultMusicPicture.png';
const tagReaderTimeoutTime = 5000;

/* eslint-disable no-undef, no-unused-vars */

// https://stackoverflow.com/questions/3231459/create-unique-id-with-javascript/3231532
function uniqueid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

var selectFolder = () => {};
var updateAutomaticGeneratedFields = () => {};
var itemViewerButtonsFunctions = [];

function resetFields() {
    document.getElementsByClassName('albums')[0].innerHTML = '<h1 class="title">Albuns</h1>';
    document.getElementsByClassName('artists')[0].innerHTML = '<h1 class="title">Artists</h1>';
    document.getElementsByClassName('musics')[0].innerHTML = '<h1 class="title">Musics</h1>';
    document.getElementsByClassName('videos')[0].innerHTML = '<h1 class="title">Videos</h1>';
}

window.loadedComplete = () => {
    console.log('ActivePage javascript loaded!');
    const fs = window.require('fs');
    const path = window.require('path');

    const thumbsupply = window.require('thumbsupply');
    var ffmpeg = window.ffmpeg;
    
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

    updateAutomaticGeneratedFields = () => {
        if (!localStorage.getItem('mediaFolders') || localStorage.getItem('mediaFolders') === '') {return;}
        var folders = localStorage.getItem('mediaFolders').split(',');
        var treadtedFolders = [];
        folders.forEach(Path => {treadtedFolders.push(Path.replace(/SData-SemilyCollomI/g, ','));});
        resetFields();
        treadtedFolders.forEach((Folder) => {
            setTimeout(() => {
                GenerateAutomaticFields(Folder, uniqueid());
            }, 3000);
        });
    };
    updateAutomaticGeneratedFields();

    function GenerateAutomaticFields(Directory, identifiyer) {
        window.ipcRenderer.send('SubProcess.Fs.ReadDirAsync', [Directory, identifiyer]);
        window.ipcRenderer.on('SubProcess.Fs.ReadDirAsync.Results', (event, files) => {generator(files);});
        function generator(files) {
            window.ipcRenderer.removeListener('SubProcess.Fs.ReadDirAsync.Results', (event, files) => {generator(files);});
            if (!files) {return;}
            files = JSON.parse(files);
            if (files[1] !== identifiyer) {return;}
            files = files[0];
            files.forEach(async (file) => {
                if (fs.lstatSync(path.resolve(Directory, file)).isDirectory()) {
                    GenerateAutomaticFields(path.resolve(Directory, file), uniqueid());
                } else {
                    if (getMimeTypefromString(getExtName(file))) {
                        if (getMimeTypefromString(getExtName(file)) === 'video') {
                            var imageThumb = '';
                            thumbsupply.generateThumbnail(path.resolve(Directory, file), {
                                size: thumbsupply.ThumbSize.MEDIUM, // or ThumbSize.LARGE
                                forceCreate: true,
                                cacheDir: '~/myapp/cache',
                            }).then(thumb => {
                                // serve thumbnail
                                imageThumb = path.resolve(window.rootPath, thumb);
                                proceed();
                            }).catch(err => {
                                // thumbnail doesn't exist
                                console.log(err);
                                imageThumb = defaultVideoPicture;
                                proceed();
                            });

                            // eslint-disable-next-line no-inner-declarations
                            function proceed() {
                                if (!fs.existsSync(imageThumb)) {imageThumb = defaultVideoPicture;}
                                var ContentData = {
                                    type: 'video',
                                    thumb: imageThumb,
                                    // eslint-disable-next-line max-len
                                    title: file.substring(0, file.length - path.extname(path.resolve(Directory, file)).length).replace(/'/g, '<{InsertApostrofuHere}>'),
                                    author: 'No Author',
                                    filePath: path.resolve(Directory, file).replace(/'/g, '<{InsertApostrofuHere}>'),
                                };
                                // eslint-disable-next-line max-len
                                document.getElementsByClassName('videos')[0].innerHTML += '<button class="" onclick="window.ipcRenderer.emit(`media.playcontent`, ' + JSON.stringify(ContentData).replace(/"/g, '\'') + ');"><img class="Icon" src="' + imageThumb + '"></img><span class="subtext">' + file.substring(0, file.length - path.extname(path.resolve(Directory, file)).length) + '</span></button>';
                            
                            }
                        } else if (getMimeTypefromString(getExtName(file)) === 'audio') {
                            var imageSrc = '';
                            var titleSrc = '';
                            var authorSrc = '';
                            var jsmediatags = window.require('jsmediatags');
                            // eslint-disable-next-line no-inner-declarations
                            function DefaultResult() {
                                imageSrc = defaultMusicPicture;
                                // eslint-disable-next-line max-len
                                titleSrc = file.substring(0, file.length - path.extname(path.resolve(Directory, file)).length);
                                authorSrc = 'No author';
                                proceed();
                            }
                            var jsMediaTagsTimeout = setTimeout(DefaultResult, tagReaderTimeoutTime);
                            jsmediatags.read(path.resolve(Directory, file), {
                                onSuccess: function(tag) {
                                    clearTimeout(jsMediaTagsTimeout);
                                    if (!tag) {
                                        console.log('[JSMediaTags] No tag founded! ' + path.resolve(Directory, file));
                                        DefaultResult();
                                        return;
                                    }
                                    var image = tag.tags.picture;
                                    if (image) {
                                        var base64String = '';
                                        for (var i = 0; i < image.data.length; i++) {
                                            base64String += String.fromCharCode(image.data[i]);
                                        }
                                        var base64;
                                        if (base64String !== '') {
                                            base64 = 'data:' + image.format + ';base64,' + window.btoa(base64String);
                                        } else {
                                            base64 = defaultMusicPicture;
                                        }
                                        imageSrc = base64;
                                        titleSrc = tag.tags.title || file;
                                        authorSrc = tag.tags.artist;
                                        proceed();
                                    } else {
                                        DefaultResult();
                                    }
                                },
                                onError: () => {clearTimeout(jsMediaTagsTimeout);DefaultResult();},
                            });

                            // eslint-disable-next-line no-inner-declarations
                            function proceed() {
                                var ContentData = {
                                    type: 'audio',
                                    thumb: imageSrc,
                                    title: titleSrc.replace(/'/g, '<{InsertApostrofuHere}>'),
                                    author: authorSrc || 'No author',
                                    filePath: path.resolve(Directory, file).replace(/'/g, '<{InsertApostrofuHere}>'),
                                };
                                // eslint-disable-next-line max-len
                                document.getElementsByClassName('musics')[0].innerHTML += '<button class="" onclick="window.ipcRenderer.emit(`media.playcontent`, ' + JSON.stringify(ContentData).replace(/"/g, '\'') + ');"><img class="Icon" src="' + imageSrc + '"></img><span class="subtext">' + titleSrc + '</span></button>';
                            }

                        }
                    }
                }
            });
        }
    }
};

function updateFoldersList() {
    resetFields();
    [...document.getElementsByClassName('AddedFolder')].forEach((element) => {
        element.outerHTML = '';
    });
    if (!localStorage.getItem('mediaFolders') || localStorage.getItem('mediaFolders') === '') {return;}
    var folders = localStorage.getItem('mediaFolders').split(',');
    var treadtedFolders = [];
    folders.forEach(Path => {treadtedFolders.push(Path.replace(/SData-SemilyCollomI/g, ','));});
    itemViewerButtonsFunctions = [];
    treadtedFolders.forEach((Folder, index) => {
        var icon = '../../assets/images/folderIcon.png';
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
                    onclick: 'var NewFolders = `' + folders.toString().replace(/\\/g, '\\\\') + '`.toString().split(`,`).filter((value,index) => index !== ' + index + ');localStorage.setItem(`mediaFolders`, NewFolders);updateFoldersList();dimissItemViewer(200);',
                    oncLickIndex: index,
                }
            ]
        };
        itemViewerButtonsFunctions.push(item);
        // eslint-disable-next-line max-len, quotes
        document.getElementsByClassName('folders')[0].innerHTML += '<button class="AddedFolder" onclick="createItemViewer(' + JSON.stringify(item).replace(/"/g, "'") + ')"><img class="Icon" src="' + icon + '"></img><span class="subtext">' + Folder + '</span></button>';

    });
    updateAutomaticGeneratedFields();
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
        // eslint-disable-next-line max-len
        document.getElementsByClassName('itemViewerButtonsArea')[0].innerHTML += '<button class="' + buttonInfo.name + '" onclick="' + itemViewerButtonsFunctions[buttonInfo.oncLickIndex].buttons[indexo].onclick + '">' + buttonInfo.text + '</button>';
    });
    document.getElementsByClassName('contentBlocker')[0].style.display = 'block';
    document.getElementsByClassName('contentBlocker')[0].style.opacity = 1;
}

function getExtName(fileName) {
    var file = fileName.toString();
    var lastDotIndex = file.lastIndexOf('.');
    var ext = file.slice(lastDotIndex);
    return ext;
}