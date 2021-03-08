/* eslint-disable no-undef, no-unused-vars */

var selectFolder = () => {};

window.loadedComplete = () => {
    console.log('ActivePage javascript loaded!');

    selectFolder = () => {
        window.dialog.showOpenDialog({
            properties: ['openDirectory']
        }).then(results => {
            if (results.canceled) {return;}
            results.filePaths[0] = results.filePaths[0].split(',').join('/Data-SemilyCollom/');

            var currentFolders = localStorage.getItem('mediaFolders');
            if (currentFolders) {
                var folders = actualFolder.split(',');
                if (!folders.includes(results.filePaths[0])) {
                    currentFolders.push(results.filePaths[0]);
                }
            } else {
                currentFolders = results.filePaths[0];
            }
            localStorage.setItem('mediaFolders', currentFolders);
            updateFoldersList();
        });
    };

};

function updateFoldersList() {
    var folders = localStorage.getItem('mediaFolders').split(',');
}