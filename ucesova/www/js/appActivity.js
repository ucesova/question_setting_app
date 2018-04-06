
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
		var earthquakelayer;
	
		// create the code to get the Earthquakes data using an XMLHttpRequest
		function getEarthquakes() {
			client = new XMLHttpRequest();

		client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
			client.onreadystatechange = earthquakeResponse; // note don't use earthquakeResponse() withbrackets as that doesn't work
			client.send();
		}
		// create the code to wait for the response from the data server, and process the response once it is received
		function earthquakeResponse() {
		// this function listens out for the server to say that the data is ready - i.e. has state 4
			if (client.readyState == 4) {
				// once the data is ready, process the data
				var earthquakedata = client.responseText;
				loadEarthquakelayer(earthquakedata);
			}
		}		
		// convert the received data - which is text - to JSON format and add it to the map
		function loadEarthquakelayer(earthquakedata) {
		
			// convert the text to JSON
			var earthquakejson = JSON.parse(earthquakedata);
		
			// add the JSON layer onto the map -it will apper using the default icons
			earthquakelayer = L.geoJson(earthquakejson).addTo(mymap);
			
			//change the map zoom so that all the data is shown
			mymap.fitBounds(earthquakelayer.getBounds());
		}
	
	// my personal try
	/* var marker; // define the global variable to hold the position marker.
		
		// code to track the user location
		function trackLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(showPosition);
				// intentos de centrar el mapa en torno a la posicion del usuario
				//navigator.geolocation.setView(showPosition); //(https://w3c.github.io/geolocation-api/#high-accuracy)
				//navigator.geolocation.scrollMap(showPosition);
				//no resulta e incluso hace que no me aparezca el marker
			} else {
				document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
			}
		}

		
		function showPosition(position) {
			if(marker || marker === false) { // based on https://stackoverflow.com/questions/5515310/is-there-a-standard-function-to-check-for-null-undefined-or-blank-variables-in
				marker = L.circleMarker([position.coords.latitude, position.coords.longitude], {radius: 5});
				mymap.addLayer(marker);
				mymap.setView([position.coords.latitude, position.coords.longitude], 13);
			} else {
				mymap.removeLayer(marker)
				marker = L.circleMarker([position.coords.latitude, position.coords.longitude], {radius: 5});
				mymap.addLayer(marker);
				mymap.setView([position.coords.latitude, position.coords.longitude], 13);
			}
		}
		 */
		// setView(position.coords.latitude, position.coords.longitude, 13)
		// http://leafletjs.com/reference-1.3.0.html#locate-options
		
	//know based on https://gis.stackexchange.com/questions/182068/getting-current-user-location-automatically-every-x-seconds-to-put-on-leaflet
		
	
	// placeholders for the L.marker and L.circle representing user's current position and accuracy    
    var current_position, current_accuracy;

    function onLocationFound(e) {
      // if position defined, then remove the existing position marker and accuracy circle from the map
      if (current_position) {
          mymap.removeLayer(current_position);
          mymap.removeLayer(current_accuracy);
      }

      var radius = e.accuracy / 2;

      current_position = L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

      current_accuracy = L.circle(e.latlng, radius).addTo(mymap);
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