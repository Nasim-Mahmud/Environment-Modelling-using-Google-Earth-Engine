# Environment-Modelling-using-Google-Earth-Engine
Here, I have made a model to process image classification of the environment of Bangladesh using **GOOGLE EARTH ENGINE**. From there, I have used the data of the different times of a year. To run this project, you must have access to **Earth Engine Code Editor**. To have access to Earth Engine Code editor, you must have to sign in [Earth Engine]( https://earthengine.google.com/). 
Earth Engine uses the Javascript programming language. To learn more about JS in Earth Engine, you can follow the link: 

[JavaScript for Earth Engine]( https://developers.google.com/earth-engine/tutorials/tutorial_api_01)

How to run this code
---
 To run this classifier, we are going to need a cloud-free image so that we can get the exact result. For this, I have used **USGS Landsat 8 Surface Reflectance Tier 1** imagery, but **USGS Landsat 5 TM Collection 1 Tier 1 TOA Reflectance** has also worked for me. This will filter the region of interest (ROI) in a certain date range by filtering out the least cloudy images.

![1](https://user-images.githubusercontent.com/57942968/81836192-f4875700-9564-11ea-862c-6f15e322ae17.png)

![image](https://user-images.githubusercontent.com/57942968/81836748-b8082b00-9565-11ea-9f9a-b5682a933cb9.png)

It is not necessary to import the classifier, instead I import them through coding. Both works just fine.

---
Then I have used the Marker Tool to select a region.

![image](https://user-images.githubusercontent.com/57942968/81836873-e128bb80-9565-11ea-8fe1-921625bc3645.png)
---
After selecting the region, it will automatically import its longitude and latitude. These points are important because, with it, I have to classify different regions. The default name of this marker will be **Geometry**, but I have renamed it as **ROI(Region of Interest)** for better understanding. For every single marker, it will select a pair of longitude and latitude. For multiple markers, it will select multiple longitude and latitude. But then, we need to separate those pairs and have to declare as different variables, otherwise, it won’t classify multiple ROI on single code execution. Follow the code given below.

```
var multiPoint = ee.Geometry.MultiPoint([[90.698619,23.5632490], [91.954643,22.714327]]);

// Get the individual geometries as a list.
var geometries = multiPoint.geometries();

// Get each individual geometry from the list and print it.
var pt1 = geometries.get(0);
var pt2 = geometries.get(1);
print('Point 1', pt1);
print('Point 2', pt2);
```
---
After that, I used the following script to extract images from Landsat 8 Collection and it will show the true color composite of the map in the desired ROI.

![image](https://user-images.githubusercontent.com/57942968/81837224-68762f00-9566-11ea-9071-805963c60903.png)

If you click on the layers, you will find an image option that has a checkmark on it. And after selecting the satellite view on the map, if you execute the script, you will find a darker view of the map. You can also adjust the brightness clicking the gear option next to the image option inside Layers.
Now, we need to train the classifier. To do that, we need some training data to collect. Hover over the geometry imports and select **new layer**. It will create a layer named **Geometry**. Click on the gear button next to it. I have renamed it **UrbanAreas** and changed the import as to **Feature Collection** as it is collecting training inputs. Also, I have changed the properties name from **class** to **landcover** and gave it a value of **0**.

![image](https://user-images.githubusercontent.com/57942968/81837366-978ca080-9566-11ea-9095-079908a08df8.png)
---
Now, to collect the data, I have marked some urban places inside the ROI. It is very important to mark it well, as these data are going to used to classify the whole urban area inside the ROI. Like this, I have made some other geometry imports. Those are WaterLands and GreenLands. I also changed their value of properties consecutively to 1 and 2. 

![image](https://user-images.githubusercontent.com/57942968/81837411-a6735300-9566-11ea-89cd-fd97a3efff1a.png)
---
So, now I have three classes(you can add more if you like) defined, but before collecting data from training samples, I need to merge them as a single collection, also called Feature Collection.

```
//Merge feature collection
var newfc = UrbanAreas.merge(WaterLands).merge(GreenAreas);
```
---
After this, I can use the Feature Collection to extract the reflectance data from each point. It creates the training data by overlaying the training points on the image. This adds to the Feature Collection of new properties that each item represents the image band values.

```
//Create training data
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
var training = image.select(bands).sampleRegions({
  collection: newfc,
  properties: ['landcover'],
  scale: 30
});
```
Now, I can train the classifier, using values of different landcover.

```
//Training the classifier
var classifier = ee.Classifier.smileCart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});
```
---
After that, I executed the classifier using the images from different landcover and classifiers from different bands .

```
//Run the classification
var classified = image.select(bands).classify(classifier);
```
---
Now I displayed the classification. Before that, I have adjusted the color so that the area I seperated from each other can be seperated in bare eyes. I have created the property value of **UrbanAreas = 0, WaterLands = 1 and GreenLands = 2**. So the color sequense i used here is **Black, Light Blue and Light Green**. Here, i have used the HEX Color Code but you can also use the name of the color within the **single inverted commas**. 

```
//Display classification
Map.centerObject(newfc, 11);
Map.addLayer(image,{bands: ['B4', 'B3', 'B2'], max:3},'Landsat image')
Map.addLayer(classified,
{min: 0, max: 2, palette: ['000000', '3fbfe1', '12900a']},
'classification');

Map.addLayer(newfc);
```
---
So after executing the code, it will look like this:

![image](https://user-images.githubusercontent.com/57942968/81837952-5052df80-9567-11ea-9f0c-5f357429c304.png)
---

Here, I have used multiple ROI, so as I said earlier, to use multiple ROI, you have to write the whole process all over again and have to select the areas using the existing **Geometry Imports**.

![image](https://user-images.githubusercontent.com/57942968/81838002-62348280-9567-11ea-8843-f5c643cc14dd.png)

And just repeat the process for ptr2 as well.

That’s all for now, peace.
