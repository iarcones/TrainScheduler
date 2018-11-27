
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
});

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("child_added", function (snapshot) {

    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;

    console.log(trainName);
    console.log(destination);
    console.log(frequency);
    console.log(firstTrain);
    var nextArrival = "pending";
    var minutesAway = "pending";


    

    $("#train-table").append("<thead><tr><td scope='col'>" + trainName + "</td><td scope='col'>" + destination + "</td><td scope='col'>" + frequency + "</td><td scope='col'>" + nextArrival + "</td><td scope='col'>" + minutesAway + "</td></tr></thead>")


}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


