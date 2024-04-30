var image = ee.Image(ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(roi)
    .filterDate('2019-05-01', '2023-01-30')
    .sort('CLOUD_COVER')
    .first());
Map.addLayer(image, {bands: ['SR_B4', 'SR_B3', 'SR_B2'],min:0, max: 3000}, 'image');


//Merge feature collection
var newfc = UrbanAreas.merge(WaterLands).merge(GreenAreas);
print(newfc);

//Create training data
var bands = ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7'];
var training = image.select(bands).sampleRegions({
  collection: newfc,
  properties: ['landcover'],
  scale: 30
});
print(training);

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
Map.addLayer(image,{bands: ['SR_B4', 'SR_B3', 'SR_B2'], max:3},'Landsat image')
Map.addLayer(classified,
{min: 0, max: 2, palette: ['000000', '3fbfe1', '12900a']},
'classification');

Map.addLayer(newfc);
