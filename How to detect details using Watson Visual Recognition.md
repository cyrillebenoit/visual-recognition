# How to detect details using Watson Visual Recognition


## Overview

- [Prerequisites](#prerequisites)
- [Scope](#scope)
- [Training](#training)
- [Usage](#usage)
- [Run the app](#runtheapp)
- [Potential improvements](#potential-improvements)

## Prerequisites

 - IBM Cloud account - [Sign in for a trial account](https://console.ng.bluemix.net/registration/) if you don't already have one.

## Scope

This app is designed to detect details in a large picture.

The Watson Visual Recognition service is good in recognizing **macroscopic patterns** but will usually identify two very similar images identically. To get different results from a given classifier, the images need to be sufficiently different.

The main idea there is to split the given image in several fragments, so that the details are in a macroscopic scale for the image Watson recieves.

For this project, we devide the image using a grid of a given number of rows and columns to fit the size of the details we want to detect.

We will suppose we're trying to identify if a detail is present _(OK)_ or absent _(NOK)_.

## Training

Because the data Watson will recieve from our app is the size of a detail we want to detect, the training data needs to be as well. We need to clip details from our training pictures for both OK and NOK classes of the classifier.

I strongly recommend the use of a negative classifier for unrelevant fragments of the image.

Your initial training datasets should contain between 15 and 25 pictures.

## Usage

1.  Open the app in your browser
2.  Choose your file
3.  Adjust the grid
4.  Watch the results

## Run the app

### Locally

- You can run the app locally using [npm](https://nodejs.org/).
- Clone the [GitHub repository](https://github.com/cyrillebenoit/visual-recognition).
- Open a terminal in said directory and run `npm install`.
- Copy `.config.json` and rename it `config.json`.
- Edit this file so it fits your 

### On IBM Cloud

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/cyrillebenoit/visual-recognition)



## Example (playing cards)

In this example, I'll use this app to detect the suit of a playing card.

First, I download the dataset from [this page](http://acbl.mybigcommerce.com/52-playing-cards/).

Then, I split it into testing and training datasets and run the app locally with classifier_id or api_key set to null.

![config.json](md_images/splitconfig.jpg)

In this configuration, the file will be split and the initial image will be displayed when the process is over.
You will find the fragments in the tmp folder.

