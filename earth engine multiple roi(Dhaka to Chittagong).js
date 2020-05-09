// Create a multi-part feature.
var multiPoint = ee.Geometry.MultiPoint([[90.698619,23.5632490], [91.526128,22.920735]]);

// Get the individual geometries as a list.
var geometries = multiPoint.geometries();

// Get each individual geometry from the list and print it.
var pt1 = geometries.get(0);
var pt2 = geometries.get(1);
print('Point 1', pt1);
print('Point 2', pt2);


//Main code after separating multipoint from region of interest

//For first region of interest
var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterBounds(pt1)
    .filterDate('2018-01-01', '2019-01-30')
    .sort('CLOUD_COVER')
    .first());
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'],min:0, max: 3000}, 'image');

//Merge feature collection
var newfc = UrbanAreas.merge(WaterLands).merge(GreenAreas);
//print(newfc);

//Create training data
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
var training = image.select(bands).sampleRegions({
  collection: newfc,
  properties: ['landcover'],
  scale: 30
});
//print(training);

//Training the classifier
var classifier = ee.Classifier.smileCart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});

//Run the classification
var classified = image.select(bands).classify(classifier);


//Display classification
Map.centerObject(newfc, 11);
Map.addLayer(image,{bands: ['B4', 'B3', 'B2'], max:3},'Landsat image')
Map.addLayer(classified,
{min: 0, max: 2, palette: ['000000', '3fbfe1', '12900a']},
'classification');

Map.addLayer(newfc);


//for second region of interest
var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterBounds(pt2)
    .filterDate('2018-01-01', '2019-01-30')
    .sort('CLOUD_COVER')
    .first());
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'],min:0, max: 3000}, 'image');

//Merge feature collection
var newfc = UrbanAreas.merge(WaterLands).merge(GreenAreas);
//print(newfc);

//Create training data
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
var training = image.select(bands).sampleRegions({
  collection: newfc,
  properties: ['landcover'],
  scale: 30
});
//print(training);

//Training the classifier
var classifier = ee.Classifier.smileCart().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});

//Run the classification
var classified = image.select(bands).classify(classifier);


//Display classification
Map.centerObject(newfc, 11);
Map.addLayer(image,{bands: ['B4', 'B3', 'B2'], max:3},'Landsat image')
Map.addLayer(classified,
{min: 0, max: 2, palette: ['000000', '3fbfe1', '12900a']},
'classification');

Map.addLayer(newfc);


