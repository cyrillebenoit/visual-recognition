# Watson Visual Advisor (Visual Recognition)

Application and scripts for analysing images using the Watson Visual Recognition Service.

This app was developed as a demonstration of processing images to identify specific features and details, and classifying them against custom classifiers on the Watson Visual Recognition service.  It allows an original input image to be subdivided into fragments (rectangular or square), and for these fragments to be classified against your own custom classifier.  Based upon the confidence level that Watson returns on if a particular fragment contains a feature you are looking for, it will shade that image fragment to a colour that you can specify.  The intensity of the colour shading is proportional to the confidence level returned by Watson.

A quick comment about the service and the colouring - the intensity of the colour is **not** proportional to how _much_ of a feature exists within a given image fragment.  If an image fragment contains only a small feature (say, a small crack on a pipe, or a small rust spot on a roof), but Watson is confident that the feature exists, then the whole image fragment will be strongly coloured.  Conversely, if Watson sees a larger feature but is not sure whether it matches the classifier, it will return a lower confidence level, and the image will be less strongly shaded, if at all.

## Pre-requisites

Firstly, you will need an IBM Cloud account (former Bluemix).
Register and log in [here](https://console.bluemix.net/registration/).

You will need to create a Watson Visual Recognition service from the catalogue.  This is widely available in most regions.
You can use this system with a free API key (Lite), but be aware you will be limited to **250 fragments per day with a free account** and you will have to recreate your classifier if you want to retrain it.

IBMers might wish to look [here](https://nlu-requests.mybluemix.net) for a Standard API key.

Once you have your service created, launch the tool, and create your custom classifier with its classes.  Make a note of both your API key and the classifier ID.  These will need to be added to the config.json file (details below).

**You need to have [Node.js](https://nodejs.org/) installed.**

Clone this repository and run

```shell
npm install
```

## Setup config.json

In the directory, you should find a .config.json file, it's a template to what your config.json file should look like.

Fill in your API key (40 characters), your classifier ID (e.g. Dogspoker_123456), and as many objects in the classes array as you need. Please specify the label and a color for shading for each class of the classifier you want to see on the output image.

## Good training practices

For this type of application to work properly (and hopefully best), you will need an appropriated training set. Be sure to include images similar in shape and scale to what your fragments will look like in the end. One practice is to use the app to split your training images (without any API key given in config.json, the app should split your image in the tmp folder then crash, but the files should still be available) and divide your fragments in folders.

You don't need more than 20-30 fragments in each class at first.

**Don't forget to add a negative class.**

## Classify an image

Two options here:

1. Start web app for easier upload and visualisation (output file will still be saved on your computer). Just run `npm start` and open [localhost:8080](localhost:8080) in your browser.
2. Run `node cli` and fill in the parameters through the console. (images have to be in the img subfolder)

The final merged image is the same name as your original image but prepended with aaa_

All temporary files are stored in a subfolder called 'tmp' and can be deleted if desired by executing `node clean` or by classifying another image.

Credits for the logic of this application goes to Rory Costello from who I got the [initial code](https://github.com/rorycostelloibm/visual-recognition) and ported it to be usable on different OS as well as through a web app, and with potentially less or more than 2 colors.
