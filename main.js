// Created by Joel McCune on 27 Apr 2015

require([

    // esri modules
    'esri/map',
    'esri/layers/FeatureLayer',

    // dojo modules
    'dojo/io-query',
    'dojo/domReady!'

], function(Map, FeatureLayer, ioQuery) {

    // variables for switching the urls to resources
    var url_reach_points = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/0';
    var url_reach_hydrolines = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/3';
    var url_reach_putins = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/1';
    var url_reach_takeouts = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/2';
    var url_hydro_overlay = 'http://hydrology.esri.com/arcgis/rest/services/WorldHydroReferenceOverlay/MapServer';

    // test using reach id 2245, the upper sultan

    // collect reach id from query string
    function getReachId(){

        // little utility to pad reach id's with leading zeros collected from
        // http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
        function padWithZeros(reachIdAsInt, size) {

            // convert to an integer
            var string = reachIdAsInt+"";

            // keep adding leading zeros until reaching maximum size
            while (string.length < size) string = "0" + string;

            // return the result
            return string;
        }

        // get the document url
        var url = document.URL;

        // peel off everything in the url following the question mark, the portion that is the query string
        var query = url.substring(url.indexOf('?') + 1, url.length);

        // use ioQuery to convert the query string to a JSON object and access the reachid key
        var reachIdInt = ioQuery.queryToObject(query)['reachid'];

        // since the reach id's are stored in the database as eight digit strings, pad the string with zeros and return
        return padWithZeros(reachIdInt, 8);
    }

    // query the layer using the reach id and get the extent of the feature
    function getQueryExtent(layer, reachId){

        // query the layer
        layer.queryFeatures("reachid = '" + reachId + "'", function(layer){

            //

        })

    }

    // get the reachid from the query string
    var reachId = getReachId();

    // create map object
    var map = new Map('map-div', {
        basemap: 'dark-gray'
    });

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

    // apply the same definition expression to all reach layers
    //for (var i = 0; i < layer_list_reach.length; i++){
    //    layer_list_reach[i].setDefinitionExpression("reachid = '" + reachId + "'");
    //}

    // add all three reach layers to the map
    for (var i = 0; i < layer_list_reach.length; i++){
        map.addLayer(layer_list_reach[i]);
    }

});