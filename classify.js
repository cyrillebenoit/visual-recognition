// Watson Visual Recognition Tool
// Rory Costello - rory.costello@au1.ibm.com
// V1 - 2 Mar 2018

// Tasks for you, the reader, to complete:
// Update your api_key on row 17
// Update your classifier ID on row 49

var watson = require('watson-developer-cloud');
var fs = require('fs');
var spawn = require('child_process');
var exec = require('child_process').exec;
var inquirer = require('inquirer');
var csv = require('csv');

var visual_recognition = watson.visual_recognition({
  api_key: '',// ** UPDATE ME ** - Change API key for your own Watson Vision instance
  version: 'v3',
  version_date: '2016-05-20'
});

var shade_threshold = 12; // This value sets whether the script applies shading to an image fragment or not.  This is in % and already scaled up by 100.

console.log('Watson Visual Recognition - image splitter, classifier, and assembler');
console.log('Stage 2: Classification process via Watson VR service');

fs.readFile('./tmp/.vars', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var arr = data.split(",") ;
  console.log("Parameters retrieved from temporary file:");
  console.log(data);


  console.log("Submitting fragments to Watson Visual Recognition...");
  var i, fragid, fragname, maxfrags;

  maxfrags = arr[1] * arr[2]; // cols * rows

  for (i = 0 ; i < maxfrags ; i++) {
    fragid = ("00" + i).slice (-3);
    
    fragname = "./tmp/xx"+fragid+"_"+arr[0];
    var params = {
      images_file: fs.createReadStream(fragname),
  
      classifier_ids: [''], // ** UPDATE ME ** - Insert the classifier ID from your own Watson Vision service
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
      else

        if (res && res.images && res.images.length>0) {
            // Output raw JSON if requested
            if (arr[5] == "true") {
                console.log(JSON.stringify(res, null, 2));
            }

            var c1n=res.images[0].classifiers[0].classes[0].class;
            var c1s=res.images[0].classifiers[0].classes[0].score;
            var c1ss=parseInt(c1s*100);
            
            if (res.images[0].classifiers[0].classes.length>1) {
              var c2n=res.images[0].classifiers[0].classes[1].class;
              var c2s=res.images[0].classifiers[0].classes[1].score;
              var c2ss=parseInt(c2s*100);
            } else {
              var c2n="Nothing";
              var c2s=0;
              var c2ss=0;
            }
            
            var shadecolor;
            var shadep;
            var classname;
            
            if (c1s > c2s) {
              shadecolor=arr[3];
              shadep=c1ss;
              classname = c1n;
            
            } else {
              shadecolor=arr[4];
              shadep=c2ss;
              classname=c2n;
            }
            
         
            result = '';
            if (shadep > shade_threshold) {
              // Convert and apply colour, white box around image 
              console.log("Analysed "+res.images[0].image+" as classified as "+classname+" with confidence "+shadep+"%, shading to "+shadecolor);
              var child = spawn.spawnSync(process.env.comspec, ['/c', 'c:\\ImageMagick\\convert.exe ./tmp/'+res.images[0].image+' -fill '+shadecolor+' -colorize '+shadep+'% -shave 1x1 -bordercolor white -border 1 ./tmp/zz'+res.images[0].image]);
            } else {
              // Convert but do not apply colour.  Still need to draw white box around image
              console.log("Analysed "+res.images[0].image+" as classified as "+classname+" with confidence "+shadep+"%, below threshold of "+shade_threshold+"%, not shading");
              var child = spawn.spawnSync(process.env.comspec, ['/c', 'c:\\ImageMagick\\convert.exe ./tmp/'+res.images[0].image+' -shave 1x1 -bordercolor white -border 1 ./tmp/zz'+res.images[0].image]);
            }
    
        } else {
            console.log("Caught null res image");
    // Commented out, but this next line would create a 'dummy' image fragment with a light purple shade to indicate a null image was returned
    //       var child = spawn.spawnSync(process.env.comspec, ['/c', 'c:\\ImageMagick\\convert.exe '+res.images[0].image+' -fill purple -colorize 10% -shave 1x1 -bordercolor white -border 1 zz'+res.images[0].image]);
        }
        
      });
    ;
  }   // end For loop

  console.log("All fragments submitted to Watson Visual Recognition.  On completion, please enter on a command line:");
  console.log("node merge.js");
  console.log("Your final result image will be a new file called 'aaa_"+arr[0]+"'");

  // Produce output command

  var cp = spawn.spawnSync(process.env.comspec, ['/c', 'del merge.js']);
  
  fs.writeFile("merge.js", "var spawn = require('child_process');   var cp = spawn.spawnSync(process.env.comspec, ['/c', 'c:\\\\ImageMagick\\\\montage.exe ./tmp/zzxx*_"+arr[0]+" -tile "+arr[1]+"x"+arr[2]+" -geometry +1+1 aaa_"+arr[0]+"']);", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("Image processing job submitted to Watson Visual Recognition Service, results will be returned shortly...");
  });

  
});