# Environment-Modelling-using-Google-Earth-Engine
Here, I have made a model to process image classification of the environment of Bangladesh using GOOGLE EARTH ENGINE. From there, I have used the data of the different times of a year. To run this project, you must have access to Earth Engine Code Editor. To have access to Earth Engine Code editor, you must have to sign in [Earth Engine]( https://earthengine.google.com/). 
Earth Engine uses the Javascript programming language. To learn more about JS in Earth Engine, you can follow the link: 

[JavaScript for Earth Engine]( https://developers.google.com/earth-engine/tutorial_js_01)

How to run this code
---
* To run this classifier, we are going to need a cloud-free image so that we can get the exact result. For this, I have used USGS Landsat 8 Surface Reflectance Tier 1 imagery, but USGS Landsat 5 TM Collection 1 Tier 1 TOA Reflectance has also worked for me.  This will filter the region of interest (ROI) in a certain date range by filtering out the least cloudy images.
