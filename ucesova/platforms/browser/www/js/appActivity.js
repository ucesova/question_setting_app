
// load a map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
		
// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
maxZoom:18,
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);
		
// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable
var client;
// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
var POIlayer;
	
// create the code to get the POIs data using an XMLHttpRequest
function getPOI() {
	client = new XMLHttpRequest();

client.open('GET','http://developer.cege.ucl.ac.uk:30293/getGeoJSON/questions/geom');
	client.onreadystatechange = POIResponse; // note don't use POIResponse() withbrackets as that doesn't work
	client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function POIResponse() {
// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var POIdata = client.responseText;
		loadPOIlayer(POIdata);
	}
}		
// convert the received data - which is text - to JSON format and add it to the map
function loadPOIlayer(POIdata) {
		
	// convert the text to JSON
	var POIjson = JSON.parse(POIdata);
		
	// add the JSON layer onto the map -it will apper using the default icons
	POIlayer = L.geoJson(POIjson).addTo(mymap);
			
	//change the map zoom so that all the data is shown
	mymap.fitBounds(POIlayer.getBounds());
}

		
//Code to track the user locationremoving the previous markers, now based on https://gis.stackexchange.com/questions/182068/getting-current-user-location-automatically-every-x-seconds-to-put-on-leaflet
		
	
/* // placeholders for the L.marker and L.circle representing user's current position and accuracy    
var current_position;

function onLocationFound(e) {
	// if position defined, then remove the existing position marker from the map
	if (current_position) {
		mymap.removeLayer(current_position);
	}

var radius = e.accuracy / 2;

current_position = L.circle(e.latlng,radius).addTo(mymap)
//.bindPopup("You are within " + radius + " meters from this point").openPopup();
}
	
function onLocationError(e) {
	alert(e.message);
}

mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

// wrap map.locate in a function    
function locate() {
	mymap.locate({setView: true, maxZoom: 16});
}

// call locate every 3 seconds... forever
setInterval(locate, 3000);
*/
	
// Second alternative
	
// code to track the user location
var position_marker
			
function trackLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.watchPosition(showPosition);
		navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
		} else {
			document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
		}
}
		
function showPosition(position) {
	if (position_marker){
		mymap.removeLayer(position_marker);
	}
	position_marker = L.circleMarker([position.coords.latitude, position.coords.longitude], {radius: 4}).addTo(mymap);
	mymap.setView([position.coords.latitude, position.coords.longitude], 25);
}
		
// get distance
	
/* (Now this code is inside trackLocation) 
function getDistance(){
	alert('getting distance')
	// getDistanceFromPoint is the function called once the distance has been found
	navigator.geolocation.getCurrentPosition(getDistanceFromPoint);	
} */

function getDistanceFromPoint(position){
	//find the coordinates of a point to test using this website: https://itouchmap.com/latlong.html
	// these are the coordinates of my building's garden
	var lat = 51.557102 
	var lng = -0.113329
	// returns the distance in kilometers
	var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
	document.getElementById('showDistance').innerHTML = "Distance: " + distance;
	
	var alertRadius = 0.06
	/* // code to create a proximity alert 1er intento
		if (distance < 0.06) {
			position_marker.bindPopup("</b>la distancia es menor a 0.06<br/>and alternatives.");
		} else {
			position_marker.bindPopup("</b>la distancia es mayor a 0.06<br/>and alternatives.");
		} */
	
// code to create a proximity alert 2do intento
	if (distance < alertRadius) {
		alert("you are close to a point of interest!!!!");
		/* var popup = L.popup()
		.setLatLng(51.557102 -0.113329)
		.setContent('<p>menor!<br />posible respuesta 1.</p>')
		.openOn(mymap); */
	} else { 
		alert("You are not close yet to a point of interest!!!!");
		/* L.popup()
		.setLatLng(51.557102 -0.113329)
		.setContent('<p>mayor!<br />posible respuesta 1.</p>')
		.openOn(mymap); */
	}	
}
// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	subAngle = Math.acos(subAngle);
	subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
	dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
                                             // where radius of the earth is 3956 miles
	if (unit=="K") { dist = dist * 1.609344 ;}  // convert miles to km
	if (unit=="N") { dist = dist * 0.8684 ;}    // convert miles to nautical miles
	return dist;
}


	

	
	//////////////
	
	var xhr; // define the global variable to process the AJAX request
	function callDivChange() {
		xhr = new XMLHttpRequest();
		var filename = document.getElementById("filename").value;
		xhr.open("GET", filename, true);
		xhr.onreadystatechange = processDivChange;
		try {
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		catch (e) {
			// this only works in internet explorer
		}
		xhr.send();
	}

	function processDivChange() {
		if (xhr.readyState < 4) // while waiting response from server
			document.getElementById('ajaxtest').innerHTML = "Loading...";
		else if (xhr.readyState === 4) { // 4 = Response from server has been completely loaded.
			if (xhr.status == 200 && xhr.status < 300)// http status between 200 to 299 are all successful
				document.getElementById('ajaxtest').innerHTML = xhr.responseText;
		}
	}