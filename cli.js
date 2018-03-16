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
var treat = require('./treat.js');

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

    treat.treat(answers.fname, answers.cols, answers.rows);

  });
});
