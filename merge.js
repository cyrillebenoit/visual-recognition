var path = require('path');
const im = require('simple-imagemagick');

module.exports = (arr, operations) => {
  if (operations < arr[1] * arr[2]) {
    return;
  }
  console.log("All fragments submitted to Watson Visual Recognition.  On completion, please enter on a command line:");
  console.log("node merge.js");
  console.log("Your final result image will be a new file called 'aaa_" + path.basename(arr[0]) + "'");

  // build output image
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
};
