// Created by Joel McCune on 27 Apr 2015

// test using reach id 2245, in the form of http://websiteUrl.com?reachid=2245

//var url_hydro_overlay = 'http://hydrology.esri.com/arcgis/rest/services/WorldHydroReferenceOverlay/MapServer';
//var url_reach_points = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/0';

require([

    // esri modules
    'esri/map',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    "esri/geometry/Extent",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/geometry/Point",

    // dojo modules
    'dojo/io-query',
    'dojo/domReady!'

], function(Map, ArcGISTiledMapServiceLayer, FeatureLayer, Extent, GeometryService, ProjectParameters, Point,
            ioQuery) {

    // variables for switching the urls to resources
    var urlReachHydrolines = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/3';
    var urlReachPutins = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/1';
    var urlReachTakeouts = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/2';
    var urlUsgsBasemap = 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer';
    var urlGeometryService = 'http://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer';

    // variable for the name of the reach id field
    var reachIdField = 'awid';

    // collect reach id from query string
    function getReachId(){

        // get the document url
        var url = document.URL;

        // peel off everything in the url following the question mark, the portion that is the query string
        var query = url.substring(url.indexOf('?') + 1, url.length);

        // use ioQuery to convert the query string to a JSON object, access the reachid key and return the reachid
        return ioQuery.queryToObject(query).reachid;
    }

    // get the reachid from the query string
    var reachId = getReachId();

    // create map object
    var map = new Map('map-div');

    // create a basemap layer and add it to the map
    var layerUsgsBasemap = new ArcGISTiledMapServiceLayer(urlUsgsBasemap);
    map.addLayer(layerUsgsBasemap);

    // create a feature layer for each feature reach layer
    var layerReachHydrolines = new FeatureLayer(urlReachHydrolines);
    var layerReachPutins = new FeatureLayer(urlReachPutins);
    var layerReachTakeouts = new FeatureLayer(urlReachTakeouts);

    // create a list of reach features
    var layerListReach = [
        layerReachHydrolines,
        layerReachPutins,
        layerReachTakeouts
    ];

    // use a definition expression to only show the reach matching the reach id for all reach layers
    layerReachHydrolines.setDefinitionExpression(reachIdField + " LIKE '%" + reachId + "'");
    layerReachPutins.setDefinitionExpression("putin LIKE '%" + reachId + "'");
    layerReachTakeouts.setDefinitionExpression("takeout LIKE '%" + reachId + "'");

    // add all three reach layers to the map
    for (var i = 0; i < layerListReach.length; i++){
        map.addLayer(layerListReach[i]);
    }

    // wait for the map to load so the layer properties will be available
    map.on('load', function() {

        // select the reach hydroline segments
        var queryFeatures = layerReachHydrolines.queryFeatures(reachIdField + " LIKE '%" + reachId + "'");

        // query promise
        queryFeatures.then(function(selectList){

            // get the list of feature objects
            featureList = selectList.features;

            // extent object to use for setting extent, initialized to first feature extent
            var extentNad83 = featureList[0].geometry.getExtent();

            // iterate the feature objects
            for (var i = 0; i < featureList.length; i++){

                // get the extent of the current feature
                var thisExtent = featureList[i].geometry.getExtent();

                // if the minimums or maximums for this features are less than the initial, update extent
                if (thisExtent.xmin < extentNad83.xmin){
                    extentNad83.update(thisExtent.xmin, extentNad83.ymin, extentNad83.xmax, extentNad83.ymax,
                        extentNad83.spatialReference);
                }
                if (thisExtent.ymin < extentNad83.ymin){
                    extentNad83.update(extentNad83.xmin, thisExtent.ymin, extentNad83.xmax, extentNad83.ymax,
                        extentNad83.spatialReference);
                }
                if (thisExtent.xmax > extentNad83.xmax){
                    extentNad83.update(extentNad83.xmin, extentNad83.ymin, thisExtent.xmax, extentNad83.ymax,
                        extentNad83.spatialReference);
                }
                if (thisExtent.ymax > extentNad83.ymax) {
                    extentNad83.update(extentNad83.xmin, extentNad83.ymin, extentNad83.xmax, thisExtent.ymax,
                        extentNad83.spatialReference);
                }
            }

            // set up parameters for transforming extent coordinates
            var projectParameters = new ProjectParameters();
            projectParameters.geometries = [
                new Point(extentNad83.xmin, extentNad83.ymin, extentNad83.spatialReference),
                new Point(extentNad83.xmax, extentNad83.ymax, extentNad83.spatialReference)
            ];
            projectParameters.outSR = map.spatialReference;

            // set up the geometry service object
            var geometryService = new GeometryService(urlGeometryService);

            // transform extent to WGS84 using the geometry service
            var transform = geometryService.project(projectParameters);

            // provide promise for when transform finishes
            transform.then(function(pointsExtent){

                // create a new extent object to zoom to
                var extentWgs84 = new Extent(
                    pointsExtent[0].x, pointsExtent[0].y, pointsExtent[1].x, pointsExtent[1].y, map.spatialReference
                );

                // set the map extent to the reach extent
                map.setExtent(extentWgs84, true);
            });
        });
    });
});