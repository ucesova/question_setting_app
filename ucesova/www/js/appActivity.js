// Script to load the map and the basemap tiles to the question setting app, and to define the functions 
// to pop up the coordinates where the user clicks on the map (using the Leaflet APi)

//the following script will load the map and set the default view and zoom, as well as loading the basemap tiles -->

// load the map
var mymap = L.map('mapid').setView([51.524707, -0.133494], 16);
// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
maxZoom: 18,
attribution: 'Map data &copy; <aref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + 
'<ahref="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);

// create a geoJSON feature -
var geojsonFeature = {
 "type": "Feature",
 "properties": {
 "name": "Location:",
 "popupContent": "This is where UCL is based"
 },
 "geometry": {
 "type": "Point",
 "coordinates": [-0.133494, 51.524707]
 }
};

// and add it to the map
L.geoJSON(geojsonFeature).addTo(mymap).bindPopup("<b>"+geojsonFeature.properties.name+" "+geojsonFeature.properties.popupContent+"<b>");

// create a custom popup
var popup = L.popup();
// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you

function onMapClick(e) {
popup
.setLatLng(e.latlng)
.setContent("You clicked the map at " + e.latlng.toString())
.openOn(mymap);
}

// now add the click event detector to the map
mymap.on('click', onMapClick);