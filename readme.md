# Reach Map Iframe

The resources in this repository provide an example of filtering and zooming to features based on a unique value provided as a query parameter in the url.

## Concept

The primary idea is to facilitate using an iframe to embed a map into a web page. This embedded map will zoom to and display only the features corresponding to the other information contained on the web page. This is accomplished by passing only a unique identifier to the iframe as part of the url and the map displaying the correct features and spatial extent of these features.

A query parameter is anything following a question mark when visiting a web page in the url, such as `http://website.com/place?variable01=rowdy`. The browser ignores anything following the question mark, and we can extract out the value of `variable01` and do something with the string `rowdy`. In this way, we can serve one web page, but make it change using some scripting based on these query parameters. In our case, we can make the map focus on specific features.
 
## This Implementation

This specific implementation filters an example service displaying whitewater recreation reaches of river, a stretch of river from a put in location to a take out location. Due to the braided nature of some rivers, multiple line segments can represent one reach. As a result, the logic includes the capability to get the full spatial extent of the features matching the query parameter provided in the url. In this case `reachid` is the query parameter. Based on the specific `reachid` provided, the map will filter the reach line, put in and take out layers, and zoom based on the extent of the reach line features matching the `reachid` provided as a query parameter.

## Use And Development

This repo was built using the [Yeoman](http://yeoman.io/) [WebApp generator](https://github.com/yeoman/generator-webapp). To use this repo you will need either [Node.js](https://nodejs.org/) or [io.js](https://iojs.org/en/index.html) installed on your machine. With this installed, you will also need two other packages installed globally, so you can access them no matter what directory you are in. These include [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/). To install these, open a command prompt and type:
 
     > npm install -g grunt-cli bower
     
After downloading this repo, again from the command line and in the local repo directory, type:

    > bower install
    > npm install
    
This takes care of the dependencies needed to serve the resources locally and build your final product for production. To get started with working on the web application code, you can fire up the testing server with live reload to see changes in the web application every time you save with new changes. Do this by typing the following at the command prompt and leaving the window open:

    > grunt serve
    
This will open a new tab in your default browser and reload it every time you make changes to your code. The files you likely want to work with are located in the `app` directory. Specifically, you will likely want to focus on the `app/scripts/main.js` where all the JavaScript lives, `app/index.html` for doing anything with the actual HTML, and `app\styles\main.css` for tweaking the CSS.

Once you are satisfied with your work and want to package up everything for deployment, run a build and copy the results out of the `dist` directory. Run the build by typing the following at the command line:

  > grunt build
  
This will take all your files, optimize them and put them into a new directory named `dist`. The HTML and CSS is condensed. The JavaScript is uglified. All space and comments are removed. Variables are renamed to one letter. Everything is reduced to minimal, but it all still will work. To deploy your new web mapping application, just grab the contents of this `dist` directory and put it on your web server.

## Live Preview

[Here is what the repo looks like on 28 Apr 2015 running in on CodePen and using the reachid 2245 as a query parameter for the Sultan River in Washington State.](http://codepen.io/knu2xs/pen/MwYRYE?reachid=2245) If you want to see how it changes with different reachid's, just change 2245 to 2244 in the url. It will zoom to another reach.
