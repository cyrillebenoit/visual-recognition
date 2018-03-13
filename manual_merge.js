var path = require('path');
const im = require('simple-imagemagick');
var fs = require('fs');
var config = require('./config.json');

tmpDir = path.join(path.resolve(), "tmp");

fs.readFile(path.join(tmpDir, config.varfile), 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  var arr = data.split(",");
  console.log("Parameters retrieved from temporary file:");
  console.log(data);

  im.montage(
    [
      path.join(tmpDir, 'zzxx*_' + path.basename(arr[0])),
      "-tile",
      arr[1] + "x" + arr[2],
      "-geometry",
      "+1+1",
      path.join(path.dirname(arr[0]), "aaa_" + arr[1] + "x" + arr[2] + "_" + path.basename(arr[0]))
    ],
    function(err, stdout) {
      if (err)
        throw err;
      console.log("The coloured image was successfully created at " + path.join(path.dirname(arr[0]), "aaa_" + arr[1] + "x" + arr[2] + "_" + path.basename(arr[0])));
    });
});
