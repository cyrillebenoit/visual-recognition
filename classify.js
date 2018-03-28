// Watson Visual Recognition Tool
// Rory Costello - rory.costello@au1.ibm.com
// V1 - 2 Mar 2018

let VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
let fs = require('fs');
let path = require('path');
let im = require('simple-imagemagick');
let merge = require('./merge');
let config = require('./config.json');

let operationsCompleted = 0;
let tmpDir;
let visual_recognition;
let arr;

function classify(params, callback) {
    console.log('Classifying ' + params.fragname);
    params.images_file = fs.createReadStream(params.fragname);
    let shade_threshold = 40; // This value sets whether the script applies shading to an image fragment or not.  This is in % and already scaled up by 100.

    visual_recognition.classify(params, (err, res) => {
        if (err) {
            console.log(err['code']);
            if(err['code'] === 400 || err['code'] === 500 ) {
                console.log('Could not classify ' + params.fragname);
                classify(params, callback);
            }
            else {
                process.exit(1);
            }
        } else if (res && res.images && res.images.length > 0) {
            let currentMax = -1;
            let currentClass = null;

            // GET MAXIMUM SCORE CLASS
            for (let element of res.images[0].classifiers[0].classes) {
                if (element.score > currentMax) {
                    currentMax = element.score;
                    currentClass = element;
                }
            }

            // SEEK FOR SAID CLASS IN OUR CONFIG CLASSES
            let colorKnown = false;
            for (let configClass of config.classes) {
                if (currentClass && configClass.label === currentClass.class) {
                    currentClass = configClass;
                    colorKnown = true;
                    break;
                }
            }

            // The most reacting class is known
            if (!colorKnown) {
                // Convert but do not apply colour.  Still need to draw white box around image
                console.log("Analysed " + res.images[0].image + " not classified");
                im.convert(
                    [
                        path.join(tmpDir, path.basename(res.images[0].image)),
                        // '-shave',
                        // '1x1',
                        // '-bordercolor',
                        // 'white',
                        // '-border',
                        // '1',
                        path.join(tmpDir, 'zz' + path.basename(res.images[0].image))
                    ],
                    function (err, stdout) {
                        if (err)
                            throw err;
                        merge(arr, ++operationsCompleted, callback)
                    });
            } else {
                let shadecolor = currentClass.color || currentClass.colour;
                let shadep = currentMax * 100;
                let classname = currentClass.label;

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
                            // '-shave',
                            // '1x1',
                            // '-bordercolor',
                            // 'white',
                            // '-border',
                            // '1',
                            path.join(tmpDir, 'zz' + path.basename(res.images[0].image))
                        ],
                        function (err, stdout) {
                            if (err)
                                throw err;
                            merge(arr, ++operationsCompleted, callback)
                        });
                } else {
                    // Convert but do not apply colour.  Still need to draw white box around image
                    console.log("Analysed " + res.images[0].image + " as classified as " + classname + " with confidence " + shadep + "%, below threshold of " + shade_threshold + "%, not shading");
                    im.convert(
                        [
                            path.join(tmpDir, path.basename(res.images[0].image)),
                            // '-shave',
                            // '1x1',
                            // '-bordercolor',
                            // 'white',
                            // '-border',
                            // '1',
                            path.join(tmpDir, 'zz' + path.basename(res.images[0].image))
                        ],
                        function (err, stdout) {
                            if (err)
                                throw err;
                            merge(arr, ++operationsCompleted, callback)
                        });
                }
            }
        } else {
            console.log("Caught null res image");
        }

    });
}

module.exports = (callback) => {
    operationsCompleted = 0
    visual_recognition = new VisualRecognitionV3({
        api_key: process.env.API_KEY || config.api_key,
        version: 'v3',
        version_date: '2016-05-20'
    });

    console.log('Watson Visual Recognition - image splitter, classifier, and assembler');
    console.log('Stage 2: Classification process via Watson VR service');

    tmpDir = path.join(path.resolve(), "tmp");

    fs.readFile(path.join(tmpDir, config.varfile), 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }

        arr = data.split(",");
        console.log("Parameters retrieved from temporary file:");
        console.log(data);


        console.log("Submitting fragments to Watson Visual Recognition...");
        let i,
            fragid,
            fragname,
            maxfrags;

        maxfrags = arr[1] * arr[2]; // cols * rows
        for (i = 0; i < maxfrags; i++) {
            fragid = ("00" + i).slice(-3);

            fragname = path.join(tmpDir, "xx" + fragid + "_" + path.basename(arr[0]));

            let params = {
                images_file: fs.createReadStream(fragname),
                // owners: ['me'],
                classifier_ids: [process.env.CLASSIFIER_ID || config.classifier_id],
                threshold: 0.05
                /* A comment on the threshold value
                  Although this is not a mandatory parameter, the code is expecting two classes to be returned in the JSON from Watson
                  It works out which class scores higher, then shades the image fragment against that classes designated colour
                  Therefore it works best to set this threshold value very low to ensure two classes are returned
                  In practice, the Watson Visual Recognition service often classifies negative images with range 0 - 0.1
                  The variable shade_threshold set above is what the code actually uses to determine if a colour shading should be applied or not
                */
            };

            params.fragname = fragname;
            classify(params, callback);
        }
    });
}
