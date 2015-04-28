// Created by Joel McCune on 27 Apr 2015

// test using reach id 2245, in the form of http://normalUrl.com?reachid=2245

require([

    // esri modules
    'esri/map',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/FeatureLayer',
    "esri/geometry/Extent",

    // dojo modules
    'dojo/io-query',
    'dojo/domReady!'

], function(Map, ArcGISTiledMapServiceLayer, FeatureLayer, Extent, ioQuery) {

    // variables for switching the urls to resources
    //var url_reach_points = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/0';
    var url_reach_hydrolines = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/3';
    var url_reach_putins = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/1';
    var url_reach_takeouts = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/2';
    //var url_hydro_overlay = 'http://hydrology.esri.com/arcgis/rest/services/WorldHydroReferenceOverlay/MapServer';
    var url_usgs_basemap = 'http://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer';

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
    var layer_usgs_basemap = new ArcGISTiledMapServiceLayer(url_usgs_basemap);
    map.addLayer(layer_usgs_basemap);

    // create a feature layer for each feature reach layer
    var layer_reach_hydrolines = new FeatureLayer(url_reach_hydrolines);
    var layer_reach_putins = new FeatureLayer(url_reach_putins);
    var layer_reach_takeouts = new FeatureLayer(url_reach_takeouts);

    // create a list of reach features
    var layer_list_reach = [
        layer_reach_hydrolines,
        layer_reach_putins,
        layer_reach_takeouts
    ];

    // use a definition expression to only show the reach matching the reach id for all reach layers
    layer_reach_hydrolines.setDefinitionExpression(reachIdField + " LIKE '%" + reachId + "'");
    layer_reach_putins.setDefinitionExpression("putin LIKE '%" + reachId + "'");
    layer_reach_takeouts.setDefinitionExpression("takeout LIKE '%" + reachId + "'");

    // add all three reach layers to the map
    for (var i = 0; i < layer_list_reach.length; i++){
        map.addLayer(layer_list_reach[i]);
    }

    // use query extent to get the extent of the definition query features (AGOL FeatureLayer only functionality)
    layer_reach_hydrolines.queryExtent(reachIdField + " LIKE '%" + reachId + "'", function(queryExtent){

        // cheat a little, NAD83 and WGS84 are close enough to use for this purpose
        var this_extent = new Extent({
            xmin: queryExtent.extent.xmin,
            ymin: queryExtent.extent.ymin,
            xmax: queryExtent.extent.xmax,
            ymax: queryExtent.extent.ymax
        });

        // use the extent to zoom the map to the reach
        map.setExtent(this_extent, true);
    });
});