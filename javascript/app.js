
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


var currentTime = moment().format("MM/DD/YYYY - HH:mm");
var currentMinute = (parseInt(moment().format("HH")) * 60) + parseInt(moment().format("mm"));

$("#current-time").text(currentTime);

$("#add-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

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
    console.log("firstTrain: " + firstTrain);

    // solution not used
    // var firstTrainMinute = (parseInt((firstTrain.slice(0, 2))) * 60) + parseInt(firstTrain.slice(3, 5));
   
     var firstTrainMinute = (parseInt(moment(firstTrain, "hh:mm").format("HH")) * 60) + parseInt(moment(firstTrain, "hh:mm").format("mm"));


    var elapsedTime = parseInt(currentMinute - firstTrainMinute);

    if (elapsedTime < 0) {
        var nextArrival = firstTrain;
        var minutesAway = firstTrainMinute - currentMinute;
    }
    else {
        var nextArrivalMinutes = firstTrainMinute + ((Math.floor(elapsedTime / frequency)) * frequency) + frequency;
        nextArrivalMinutes = parseInt(nextArrivalMinutes);
        var nextArrivalpreformat= moment.duration(nextArrivalMinutes, 'minutes');
        var nextArrival = nextArrivalpreformat.format("hh:mm");
        var minutesAway = nextArrivalMinutes - currentMinute;
    }

    $("#train-table").append("<thead><tr><td scope='col'>" + trainName + "</td><td scope='col'>" + destination + "</td><td class='text-center' scope='col'>" + frequency + "</td><td class='text-center' scope='col'>" + nextArrival + "</td><td class='text-center' scope='col'>" + minutesAway + "</td></tr></thead>")

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


