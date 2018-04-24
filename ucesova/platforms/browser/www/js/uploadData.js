function startDataUpload() {
	alert ("start data upload");

	var question = document.getElementById("question").value;
	var choice1 = document.getElementById("choice1").value;
	var choice2 = document.getElementById("choice2").value;
	var choice3 = document.getElementById("choice3").value;
	var choice4 = document.getElementById("choice4").value;

	//create a name/value pair string as parameters for the URL to send values to the server
	var postString = "question="+question +"&choice1="+choice1+"&choice2="+choice2+"&choice3="+choice3+"&choice4="+choice4;
	
	// now get the geometry values
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;

	// now get the radio button values
	if (document.getElementById("option1").checked) {
 		 postString=postString+"&correct_choice=choice 1";
	}
	if (document.getElementById("option2").checked) {
 		 postString=postString+"&correct_choice=choice 2";
	}
	if (document.getElementById("option3").checked) {
 		 postString=postString+"&correct_choice=choice 3";
	}
	if (document.getElementById("option4").checked) {
 		 postString=postString+"&correct_choice=choice 4";
	}

	processData(postString);
}

var client;

function processData(postString) {
   client = new XMLHttpRequest();
   client.open('POST','http://developer.cege.ucl.ac.uk:30293/uploadData',true);
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = dataUploaded;  
   client.send(postString);
}
// create the code to wait for the response from the data server, and process the response once it is received
function dataUploaded() {
  // this function listens out for the server to say that the data is ready - i.e. has state 4
  if (client.readyState == 4) {
    // change the DIV to show the response
    document.getElementById("dataUploadResult").innerHTML = client.responseText;
    }
}