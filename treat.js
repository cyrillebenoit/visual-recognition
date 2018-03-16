const mkdirp = require('mkdirp');
const fs = require('fs');
const im = require('simple-imagemagick');
const path = require('path');
const classify = require('./classify.js');
const config = require('./config.json');

exports.treat = function(filename, cols, rows, callback) {
  // Clean up splitting percentages

  let tmpDir = path.join(path.resolve(), "tmp");

  let px = Math.floor(10000 * 103 / cols) / 10000;
  let py = Math.floor(10000 * 103 / rows) / 10000;

  // Perform file system operations - these are for Windows environment
  console.log("Deleting working image fragments");
  var pattern = /(zz)?(xx).*\..+/;
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
    console.log("Splitting image " + path.resolve(filename) + " into " + px + "% cols, and " + py + "% rows");

    im.convert(
      [path.resolve(filename),
        '-crop',
        px + '%x' + py + '%',
        '-fill',
        'purple',
        '-colorize',
        '10%',
        // '-shave',
        // '1x1',
        // '-bordercolor',
        // 'white',
        // '-border',
        // '1',
        path.join(tmpDir, 'xx%03d_' + path.basename(filename))],
      function(err, stdout) {
        if (err)
          throw err;
        // Write out the variables
        fs.writeFile(path.join(tmpDir, config.varfile),
          path.resolve(filename) + ',' +
          cols + "," +
          rows, function(err) {
            if (err) {
              return console.log("error: " + err);
            }
            console.log("The image has been submitted for splitting and variables stored in a temporary file, .vars.");
            classify(callback);
          });
      });
  });
};
