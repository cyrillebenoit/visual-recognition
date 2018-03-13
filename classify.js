// Watson Visual Recognition Tool
// Rory Costello - rory.costello@au1.ibm.com
// V1 - 2 Mar 2018

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
var path = require('path');
var im = require('simple-imagemagick');
var merge = require('./merge');
var config = require('./config.json');

module.exports = () => {

  var visual_recognition = new VisualRecognitionV3({
    api_key: process.env.API_KEY || config.api_key,
    version: 'v3',
    version_date: '2016-05-20'
  });

  var operationsCompleted = 0;
  var shade_threshold = 12; // This value sets whether the script applies shading to an image fragment or not.  This is in % and already scaled up by 100.

  console.log('Watson Visual Recognition - image splitter, classifier, and assembler');
  console.log('Stage 2: Classification process via Watson VR service');

  tmpDir = path.join(path.resolve(), "tmp");

  fs.readFile(path.join(tmpDir, config.varfile), 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }

    var arr = data.split(",");
    console.log("Parameters retrieved from temporary file:");
    console.log(data);


    console.log("Submitting fragments to Watson Visual Recognition...");
    var i,
      fragid,
      fragname,
      maxfrags;

    maxfrags = arr[1] * arr[2]; // cols * rows

    for (i = 0; i < maxfrags; i++) {
      fragid = ("00" + i).slice(-3);

      fragname = path.join(tmpDir, "xx" + fragid + "_" + path.basename(arr[0]));

      var params = {
        images_file: fs.createReadStream(fragname),

        classifier_ids: [process.env.CLASSIFIER_ID || config.classifier_id], // ** UPDATE ME ** - Insert the classifier ID from your own Watson Vision service
        threshold: 0.005
      /* A comment on the threshold value
        Although this is not a mandatory parameter, the code is expecting two classes to be returned in the JSON from Watson
        It works out which class scores higher, then shades the image fragment against that classes designated colour
        Therefore it works best to set this threshold value very low to ensure two classes are returned
        In practice, the Watson Visual Recognition service often classifies negative images with range 0 - 0.1
        The variable shade_threshold set above is what the code actually uses to determine if a colour shading should be applied or not
      */
      };

      params.fragname = fragname;

      visual_recognition.classify(params, function(err, res) {
        if (err)
          console.log(err);
        else if (res && res.images && res.images.length > 0) {
          // Output raw JSON if requested
          if (arr[5] == "true") {
            console.log(JSON.stringify(res, null, 2));
          }

          var c1n = res.images[0].classifiers[0].classes[0].class;
          var c1s = res.images[0].classifiers[0].classes[0].score;
          var c1ss = parseInt(c1s * 100);

          if (res.images[0].classifiers[0].classes.length > 1) {
            var c2n = res.images[0].classifiers[0].classes[1].class;
            var c2s = res.images[0].classifiers[0].classes[1].score;
            var c2ss = parseInt(c2s * 100);
          } else {
            var c2n = "Nothing";
            var c2s = 0;
            var c2ss = 0;
          }

          var shadecolor;
          var shadep;
          var classname;

          if (c1s > c2s) {
            shadecolor = arr[3];
            shadep = c1ss;
            classname = c1n;

          } else {
            shadecolor = arr[4];
            shadep = c2ss;
            classname = c2n;
          }


          result = '';
          if (shadep > shade_threshold) {
            // Convert and apply colour, white box around image
            console.log("Analysed " + res.images[0].image + " as classified as " + classname + " with confidence " + shadep + "%, shading to " + shadecolor);
            im.convert(
              [
                path.join(tmpDir, path.basename(res.images[0].image)),
                '-fill',
                shadecolor,
                '-colorize',
                shadep + '%',
                '-shave',
                '1x1',
                '-bordercolor',
                'white',
                '-border',
                '1',
                path.join(tmpDir, 'zz' + path.basename(res.images[0].image))
              ],
              function(err, stdout) {
                if (err)
                  throw err;
                merge(arr, ++operationsCompleted)
              });
          } else {
            // Convert but do not apply colour.  Still need to draw white box around image
            console.log("Analysed " + res.images[0].image + " as classified as " + classname + " with confidence " + shadep + "%, below threshold of " + shade_threshold + "%, not shading");
            im.convert(
              [
                path.join(tmpDir, path.basename(res.images[0].image)),
                '-shave',
                '1x1',
                '-bordercolor',
                'white',
                '-border',
                '1',
                path.join(tmpDir, 'zz' + path.basename(res.images[0].image))
              ],
              function(err, stdout) {
                if (err)
                  throw err;
                merge(arr, ++operationsCompleted)
              });
          }
        } else {
          console.log("Caught null res image");
        // Commented out, but this next line would create a 'dummy' image fragment with a light purple shade to indicate a null image was returned
        //       var child = spawn.spawnSync(process.env.comspec, ['/c', 'c:\\ImageMagick\\convert.exe '+res.images[0].image+' -fill purple -colorize 10% -shave 1x1 -bordercolor white -border 1 zz'+res.images[0].image]);
        }
      });
      ;
    } // end For loop
  });
}
