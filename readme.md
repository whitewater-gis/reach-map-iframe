# Reach Map Iframe

The resources in this repository provide an example of filtering and zooming to features based on a unique value provided as a query parameter in the url.

## Concept

The primary idea is to facilitate using an iframe to embed a map into a web page. This embedded map will zoom to and display only the features corresponding to the other information contained on the web page. This is accomplished by passing only a unique identifier to the iframe as part of the url and the map displaying the correct features and spatial extent of these features.

A query parameter is anything following a question mark when visiting a web page in the url, such as `http://website.com/place?variable01=rowdy`. The browser ignores anything following the question mark, and we can extract out the value of `variable01` and do something with the string `rowdy`. In this way, we can serve one web page, but make it change using some scripting based on these query parameters. In our case, we can make the map focus on specific features.
 
## This Implementation

This specific implementation filters an example service displaying whitewater recreation reaches of river, a stretch of river from a put in location to a take out location. Due to the braided nature of some rivers, multiple line segments can represent one reach. As a result, the logic includes the capability to get the full spatial extent of the features matching the query parameter provided in the url. In this case `reachid` is the query parameter. Based on the specific `reachid` provided, the map will filter the reach line, put in and take out layers, and zoom based on the extent of the reach line features matching the `reachid` provided as a query parameter.

## Live Preview

Here is what the repo looks like on 28 Apr 2015, the results running in on CodePen and using the reachid 2245 for the Sultan River in Washington State.

<p data-height="639" data-theme-id="0" data-slug-hash="MwYRYE" data-default-tab="result" data-user="knu2xs" class='codepen'>See the Pen <a href='http://codepen.io/knu2xs/pen/MwYRYE/'>MwYRYE</a> by Joel McCune (<a href='http://codepen.io/knu2xs'>@knu2xs</a>) on <a href='http://codepen.io'>CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
