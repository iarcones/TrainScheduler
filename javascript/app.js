
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCUvFTmDisJbEvrEBK_W-WjhjHC1yXpObs",
    authDomain: "trainscheduler-c5c4d.firebaseapp.com",
    databaseURL: "https://trainscheduler-c5c4d.firebaseio.com",
    projectId: "trainscheduler-c5c4d",
    storageBucket: "trainscheduler-c5c4d.appspot.com",
    messagingSenderId: "997159820920"
};
firebase.initializeApp(config);


var database = firebase.database();
//   var connectionsRef = database.ref("/connections");
//   var connectedRef = database.ref(".info/connected");

// Whenever a user clicks the submit-bid button
var currentTime = moment().format("MM/DD/YYYY - HH:mm");
$("#current-time").text(currentTime);

$("#add-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    
    console.log(trainName);
 
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
});

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("child_added", function (snapshot) {

    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = parseInt(snapshot.val().frequency);
    var firstTrain = snapshot.val().firstTrain;

    console.log("trainName: " + trainName);
    console.log(destination);
    console.log(frequency);
    console.log(firstTrain);
    var firstTrainMinute = (parseInt((firstTrain.slice(0, 2))) * 60) + parseInt(firstTrain.slice(3, 5));
    var currentMinute = (parseInt(moment().format("HH")) * 60) + parseInt(moment().format("mm"));

    var elapsedTime = parseInt(currentMinute - firstTrainMinute);
    console.log(currentMinute);
    console.log(firstTrainMinute);
    console.log(elapsedTime);

    if (elapsedTime < 0){
        var nextArrival = firstTrain;
        var minutesAway = trainMinute - currentMinute;
    }
    else {
        var nextArrivalMinutes = firstTrainMinute + ((Math.floor(elapsedTime / frequency)) * frequency) + frequency;
        var nextArrivalHH = (Math.floor(nextArrivalMinutes/60)) 
        var nextArrivalmm = nextArrivalMinutes - (nextArrivalHH*60);

        var nextArrival = nextArrivalHH + ":" + nextArrivalmm;
    
        var minutesAway = nextArrivalMinutes - currentMinute;

    }

    $("#train-table").append("<thead><tr><td scope='col'>" + trainName + "</td><td scope='col'>" + destination + "</td><td scope='col'>" + frequency + ' (' + firstTrain + ')' + "</td><td scope='col'>" + nextArrival + "</td><td scope='col'>" + minutesAway + "</td></tr></thead>")

    console.log ("nextArrivalMinutes: " + nextArrivalMinutes);

    console.log ("minutesAway: " + minutesAway);

    console.log("-------------")



}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


