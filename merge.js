const path = require('path');
const im = require('simple-imagemagick');
const cclean = require('./cloudclean');

module.exports = (arr, operations, callback) => {
    let tmpDir = path.join(path.resolve(), "tmp");

    if (operations < arr[1] * arr[2]) {
        return;
    }

    console.log("Your final result image will be a new file called 'aaa_" + path.basename(arr[0]) + "'");

    let newFile = "aaa_" + arr[1] + "x" + arr[2] + "_" + path.basename(arr[0]);
    // build output image
    im.montage(
        [
            path.join(tmpDir, 'zzxx*_' + path.basename(arr[0])),
            "-tile",
            arr[1] + "x" + arr[2],
            "-geometry",
            "+0+0",
            path.join(path.dirname(arr[0]), newFile)
        ],
        function (err, stdout) {
            if (err)
                throw err;
            console.log("The coloured image was successfully created at " + newFile);
            cclean(newFile);
            callback('img/' + newFile);
        });
};
