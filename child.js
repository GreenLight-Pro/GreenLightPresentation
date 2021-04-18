const fs = require('fs');

console.log('Worker ' + process.pid + ' active!');
process.on('message', (msg) => {
    if (msg.action === 'Fs.ReadDirAsync') {
        fs.readdir(msg.content[0], (err, files) => {
            if (err) {return process.emit('error');}
            process.send({action: 'SubProcess.Fs.ReadDirAsync.Results', content: [files, msg.content[1]]});
        });
    }
});