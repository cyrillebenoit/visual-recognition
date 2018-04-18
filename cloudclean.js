const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function clear(directory, keep) {
    mkdirp(directory, err => {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                if (file !== keep) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                    });
                }
            }
        });
    });
}

module.exports = function (file) {
    console.log("Deleting all images.");
    let tmpDir = path.join(path.resolve(), "tmp");
    let imgDir = path.join(path.resolve(), "img");
    clear(tmpDir);
    clear(imgDir, file);
};