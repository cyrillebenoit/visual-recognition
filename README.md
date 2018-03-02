# visual-recognition

Scripts for analysing images using the Watson Visual Recognition Service.

These scripts were developed as a demonstration of processing images to identify specific features, and classifying them against custom classifiers on the Watson Visual Recognition service.  They allow an original input image to be subdivided into fragments (rectangular or square), and for these fragments to be classified against your own custom classifier.  Based upon the confidence level that Watson returns on if a particular fragment contains a feature you are looking for, it will shade that image fragment to a colour that you can specify.  The intensity of the colour shading is proportional to the confidence level returned by Watson.  To show the processing a little more clearly, returned image fragments have a 1 pixel border shaved off the returned image, which is then redrawn in white.  This allows for the final, reassembled image to be seen more clearly as a processed chequerboard.

A quick comment about the service and the colouring - the intensity of the colour is <b>not</b> proportional to how <i>much</i> of a feature exists within a given image fragment.  If an image fragment contains only a small feature (say, a small crack on a pipe, or a small rust spot on a roof), but Watson is confident that the feature exists, then the whole image fragment will be strongly coloured.  Conversely, if Watson sees a larger feature but is not sure whether it matches the classifier, it will return a lower confidence level, and the image will be less strongly shaded, if at all.

There are a number of operating system commands used throughout these scripts that execute under Node.js, and are designed for the Windows operating system.

<h2>Pre-requisites:</h2>

Firstly, you will need a Bluemix account (IBM Cloud).  Register and log in at bluemix.net.

You will need to create a Watson Visual Recognition service from the catalogue.  This is widely available in most Bluemix regions.
You will almost certainly need the 'Standard' version of this service (not 'Lite').  The lite version does not allow you to retrain and update classifiers.
Please be aware that <b>the standard version does involve charges to your account</b>.

IBMers might wish to look at:  https://nlu-requests.mybluemix.net

Once you have your service created, launch the tool, and create your custom classifier with its two classes.  Make a note of both your API key and the classifier ID.  These will need to be added to the classify.js file (details below).

To execute the scripts on your Windows laptop, you will need:<br />
<ul>
<li>Node (e.g. from https://nodejs.org/)</li>
<li>Git Bash (e.g. from https://gitforwindows.org/)</li>
<li>ImageMagick (e.g. from https://www.imagemagick.org/script/download.php)</li>
</ul>

For some reason, the path handling executing the ImageMagick commands does not like Windows syntax, i.e. with backslashes or spaces in the path name.  Once ImageMagick is installed (e.g. C:\Program Files\ImageMagick-7.0.7-Q16\), please move the directory (or copy) to simply:  C:\ImageMagick\

The code is expecting to find files at that location, e.g. be able to execute C:\ImageMagick\convert.exe

Once you have the scripts from this Github repository in a folder of your choice (i.e. your folder contains split.js, classify.js etc), please start a Git bash shell in that directory and install the required Node modules:

<code>npm install fs</code><br />
<code>npm install child_process</code><br />
<code>npm install inquirer</code><br />
<code>npm install watson-developer-cloud</code><br />
<code>npm install csv</code><br />

You should be able to execute the JavaScript code within Git Bash by typing:

<code>node filename.js</code><br />

e.g. node split.js

There are also two utility shell scripts to assist you if you wish.  These can also be called from within Git Bash as follows:

<code>sh predupe.sh</code><br />
<code>sh number.sh</code><br />

as necessary.

<h2>To classify an image:</h2>
Firstly, you should have an image in your directory, e.g. dogs-playing-poker.png

Make sure you have a Bluemix account, Visual Recognition service, and custom classifier created.

Edit the file classify.js, and change the parameters on lines 17 and 49 to be your own API key and own classifier ID.  Make sure you use the specific classifier ID returned by Watson.  For instance, if you create a classifier in the Visual Recognition tool called 'Dogspoker', Watson will append a set of numbers to make it unique to you, e.g. 'Dogspoker_123456'.  When editing classify.js, use the value with the appended numbers on line 49.

1. Capture input variables [Executed in Git Bash with 'node split.js']
2. Split file into image fragments
3. (Optional) Prepare post-processing place-holder images, in case you experience errors, and want to preserve image orientation [Executed in Git Bash with 'sh predupe.sh']
4. Classify image fragments against your classifier [Executed in Git Bash with 'node classify.js']
5. Reassemble classified image fragments into a single merged, processed image [Executed in Git Bash with 'node merge.js']
6. (Optional) Label each input and output image fragment with a sequence number, to better do a direct comparison on actual results vs expected results [Executed in Git Bash with 'sh number.sh']

In summary:
<code>node split.js</code><br />
<code>(enter variables)</code><br />
<code>sh predupe.sh</code><br />
<code>node classify.js</code><br />
<code>node merge.js</code><br />
<code>(OPTIONAL) sh number.sh</code><br />

The file merge.js is custom created by the code (in classify.js) as it contains the requisite variables to assemble the file, once the classification is completed.

The final merged image is the same name as your original image but prepended with aaa_

Eg. dogs-playing-poker.png becomes aaa_dogs-playing-poker.png, for ease of finding in your directory.

All temporary files are stored in a subfolder called 'tmp' and can be deleted if desired by executing 'node clean.js' within a Git Bash shell (run from the parent directory, i.e. where your original image is located).

I make no claims to being a professional programmer, but having developed these these scripts, they have proved useful in demonstrating the service and hope you find them of interest and possibly of some help.

