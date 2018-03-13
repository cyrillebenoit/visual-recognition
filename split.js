// Watson Visual Recognition Tool
// Rory Costello - rory.costello@au1.ibm.com
// V1 - 2 Mar 2018

var fs = require('fs');
var inquirer = require('inquirer');
var path = require('path');
var im = require('simple-imagemagick');
var mkdirp = require('mkdirp');
var classify = require('./classify');
var config = require('./config.json');
var loopCount = 0;
console.log('Watson Visual Recognition - image splitter, classifier, and assembler');

var questions = [
  {
    type: 'input',
    name: 'fname',
    message: 'Filename of source graphic image',
    default: 'mixed.jpeg'
  },
  {
    type: 'input',
    name: 'cols',
    message: 'Number of columns to split the image into',
    default: 10
  },
  {
    type: 'input',
    name: 'rows',
    message: 'Number of rows to split the image into',
    default: 10
  },
  {
    type: 'input',
    name: 'colour1',
    message: 'Colour to shade the first classifier',
    default: 'red'
  },
  {
    type: 'input',
    name: 'colour2',
    message: 'Colour to shade the second classifier',
    default: 'green'
  },
  {
    type: 'confirm',
    name: 'showraw',
    message: 'Display raw output from Watson classifier? (JSON)',
    default: false
  }

];

tmpDir = path.join(path.resolve(), "tmp");

fs.readdir(path.join(path.resolve(), "img"), function(err, items) {
  console.log('Available files: ');
  for (var i = 0; i < items.length; i++) {
    if (!(items[i][0] == '.' || items[i].includes('aaa')))
      console.log(items[i]);
  }

  inquirer.prompt(questions).then(function(answers) {
    console.log('\nSummary of input variables:');

    answers.fname = 'img/' + answers.fname;
    console.log(JSON.stringify(answers, null, '  '));

    // Clean up splitting percentages

    var px,
      py,
      zz; // zz is just a temp variable to calculate how many image fragments we will get

    px = Math.floor(10000 * 100 / answers.cols) / 10000;
    py = Math.floor(10000 * 100 / answers.rows) / 10000;

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
      console.log("Splitting image " + path.resolve(answers.fname) + " into " + px + "% cols, and " + py + "% rows");

      im.convert(
        [path.resolve(answers.fname),
          '-crop',
          px + '%x' + py + '%',
          '-fill',
          'purple',
          '-colorize',
          '10%',
          '-shave',
          '1x1',
          '-bordercolor',
          'white',
          '-border',
          '1',
          path.join(tmpDir, 'xx%03d_' + path.basename(answers.fname))],
        function(err, stdout) {
          if (err)
            throw err;
          // Write out the variables
          fs.writeFile(path.join(tmpDir, config.varfile),
            path.resolve(answers.fname) + ',' +
            answers.cols + "," +
            answers.rows + "," +
            answers.colour1 + ',' +
            answers.colour2 + ',' +
            answers.showraw
            , function(err) {
              if (err) {
                return console.log("error: " + err);
              }

              console.log("The image has been submitted for splitting and variables stored in a temporary file, .vars.");

              classify();
            });
        });
    });
  });
});
