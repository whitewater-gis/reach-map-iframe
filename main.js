// Created by Joel McCune on 27 Apr 2015

// test using reach id 2245, in the form of http://normalUrl.com?reachid=2245

require([

    // esri modules
    'esri/map',
    'esri/layers/FeatureLayer',
    "esri/geometry/Extent",

    // dojo modules
    'dojo/io-query',
    'dojo/domReady!'

], function(Map, FeatureLayer, Extent, ioQuery) {

    // variables for switching the urls to resources
    //var url_reach_points = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/0';
    var url_reach_hydrolines = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/3';
    var url_reach_putins = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/1';
    var url_reach_takeouts = 'http://services.arcgis.com/SgB3dZDkkUxpEHxu/arcgis/rest/services/aw_reach_17_search/FeatureServer/2';
    //var url_hydro_overlay = 'http://hydrology.esri.com/arcgis/rest/services/WorldHydroReferenceOverlay/MapServer';

    // variable for the name of the reach id field
    var reachIdField = 'awid';

    // collect reach id from query string
    function getReachId(){

        // get the document url
        var url = document.URL;

        // peel off everything in the url following the question mark, the portion that is the query string
        var query = url.substring(url.indexOf('?') + 1, url.length);

        // use ioQuery to convert the query string to a JSON object, access the reachid key and return the reachid
        return ioQuery.queryToObject(query)['reachid'];
    }

    // query the layer using the reach id and get the extent of all the features
    function getQueryExtent(layer, reachField, reachId){

        // select the features matching the reach id
        layer.selectFeatures(

            // create query string
            reachField + " LIKE '%" + reachId + "'",

            // create a new selection
            FeatureLayer.SELECTION_NEW,

            // once the features are selected, invoke the callback
            function(selectedFeatures){

                // set initial bounds to extent of first object
                var first_extent = selectedFeatures[0].geometry.getExtent();
                var reach_xmin = first_extent.xmin,
                    reach_ymin = first_extent.ymin,
                    reach_xmax = first_extent.xmax,
                    reach_ymax = first_extent.ymax;

                // loop through all the selected features
                for (var i = 0; i < selectedFeatures.length; i++){

                    // save this feature extent to a variable
                    var extent_this = selectedFeatures[i].geometry.getExtent();

                    // if the minimums are less than the previously saved values
                    if (extent_this.xmin < reach_xmin){ reach_xmin = extent_this.xmin; }
                    if (extent_this.ymin < reach_ymin){ reach_ymin = extent_this.ymin; }

                    // if the maximums are more than the previously saved values
                    if (extent_this.xmax > reach_xmax){ reach_xmax = extent_this.xmax; }
                    if (extent_this.ymax > reach_ymax){ reach_ymax = extent_this.ymax; }
                }

                // return a new extent object from the results with the maximum extents
                return new Extent({'xmin': reach_xmin, 'ymin': reach_ymin, 'xmax': reach_xmax, 'ymax': reach_ymax});
            }
        );
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

    // use a definition expression to only show the reach matching the reach id for all reach layers
    layer_reach_hydrolines.setDefinitionExpression(reachIdField + " LIKE '%" + reachId + "'");
    layer_reach_putins.setDefinitionExpression("putin LIKE '%" + reachId + "'");
    layer_reach_takeouts.setDefinitionExpression("takeout LIKE '%" + reachId + "'");

    // add all three reach layers to the map
    for (var i = 0; i < layer_list_reach.length; i++){
        map.addLayer(layer_list_reach[i]);
    }

    // set the extent of the map to the extent of the hydroline geometry
    map.setExtent(getQueryExtent(layer_reach_hydrolines, reachIdField, reachId));
});