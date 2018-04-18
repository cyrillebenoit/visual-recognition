const fs = require('fs');
const classifier = require('./treat.js');

exports.sendImage = function (request, response) {
    let file = request.file.path + '.png';
    fs.rename(request.file.path, file, () => {
        return response.status(200).send(file);
    });
};

exports.treat = function (request, response) {
    let fn = request.body.filename;
    let cols = Math.floor(request.body.cols);
    let rows = Math.floor(request.body.rows);

    classifier.treat(fn, cols, rows, (res) => {
        return response.status(200).send(res);
    });
};
