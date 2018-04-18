let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');

console.log("Deleting working image fragments");
tmpDir = path.join(path.resolve(), "tmp");
let pattern = /(zz)?(xx).*\..+/;
mkdirp(tmpDir, err => {
    fs.readdir(tmpDir, (err, fileNames) => {
        if (err)
            throw err;

        // iterate through the found file names
        for (const name of fileNames) {

            // if file name matches the pattern
            if (pattern.test(name)) {
                // try to remove the file and log the result
                fs.unlink(path.join(tmpDir, name), (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
});
