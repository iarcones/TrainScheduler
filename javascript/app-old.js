
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



var update;
var database = firebase.database();
var counterRefresh = 0;
var firstTime = 0;
currentTime = moment().format("MM/DD/YYYY - HH:mm");
$("#current-time").text(currentTime);
var currentMinute = (parseInt(moment().format("HH")) * 60) + parseInt(moment().format("mm"));

var tablePosition = 0;
var tableTrain = [];

$("#add-train-btn").on("click", function (event) {
    // Prevent form from submitting
    event.preventDefault();

    $("#error-text").text("");

    // Get the input values
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = parseInt($("#frequency-input").val().trim());


    if (trainName === "" || destination === "" || firstTrain === "" || frequency === "") {
        $("#error-text").text("<--- All fields are mandatory, please complete the form --->");
        return;
    }

    // validate first train input datatype and frequency
    if (!Number.isInteger(frequency)) {
        console.log("error frequency")
        $("#error-text").text("Please enter valid frequency");
        return;
    }

    // validate military date with moment.js and control that is not 24:mm 

    var validDate = moment(firstTrain, "HH:mm", true).isValid()
    console.log("validDate: ", validDate)

    if (!validDate) {
        console.log("error not all the inputs")
        $("#error-text").text("Please enter valid first train format");
        return;
    }
    if (parseInt(firstTrain.split(":")[ 0 ]) === 24) {
        console.log("error not all the inputs")
        $("#error-text").text("Please enter valid first train format");
        return;
    }

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

    var key = snapshot.key
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = parseInt(snapshot.val().frequency);
    var firstTrain = snapshot.val().firstTrain;

    // console.log("trainName: " + trainName);
    // console.log("firstTrain: " + firstTrain);

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
        var nextArrivalpreformat = moment.duration(nextArrivalMinutes, 'minutes');
        var nextArrival = nextArrivalpreformat.format("hh:mm");
        var minutesAway = nextArrivalMinutes - currentMinute;
    }



    // $("#train-table > tbody").append(`<tr><td scope='col'>${ trainName }</td><td scope='col'>${ destination }</td><td class='text-center' scope='col'>${ frequency }</td><td class='text-center' scope='col'>${ nextArrival }</td><td class='text-center' scope='col'id=m${ tablePosition }>${ minutesAway }</td><td scope='col'><button key=${ key } class="btn btn-danger delete">Delete</button></td></tr></tr>`)

    $("#train-table > tbody").append(`<tr><td scope='col'>${ trainName }</td><td scope='col'>${ destination }</td><td scope='col'class='text-center' id=n${ tablePosition }>${ nextArrival }</td><td scope='col' class='text-center'>${ frequency }</td><td scope='col' class='text-center' id=m${ tablePosition }>${ minutesAway }</td><td scope='col'><button key=${ key } class="btn btn-outline-danger delete content-center">delete</button></td></tr>`)


    $(".delete").on("click", function (event) {
        event.preventDefault()

        // GET THE DB KEY OF THE TRAIN TO BE DELETED
        var key = $(this).attr('key')

        // EMPTY THE TR ROW 
        $(this).parent().parent().empty()

        // DELETE THE TRAIN FROM THE DB
        database.ref().child(key).remove();

    })

    if (firstTime === 0) {
        firstTime = 1;
        update = setInterval(updateInfo, 60000);
    }

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});


function updateInfo () {
    // pending solve the update without reload the page

    currentTime = moment().format("MM/DD/YYYY - HH:mm");
    $("#current-time").text(currentTime);

    currentMinute = (parseInt(moment().format("HH")) * 60) + parseInt(moment().format("mm"));


    for (var i = 0; i < tableTrain.length; i++) {

        var firstTrainMinute = (parseInt(moment(tableTrain[ i ][ 0 ], "hh:mm").format("HH")) * 60) + parseInt(moment(tableTrain[ i ][ 0 ], "hh:mm").format("mm"));

        var elapsedTime = parseInt(currentMinute - firstTrainMinute);

        if (elapsedTime < 0) {
            var nextArrival = firstTrain;
            var minutesAway = firstTrainMinute - currentMinute;
        }
        else {
            var nextArrivalMinutes = firstTrainMinute + ((Math.floor(elapsedTime / tableTrain[ i ][ 1 ])) * tableTrain[ i ][ 1 ]) + tableTrain[ i ][ 1 ];
            nextArrivalMinutes = parseInt(nextArrivalMinutes);

            var nextArrivalpreformat = moment.duration(nextArrivalMinutes, 'minutes');
            var nextArrival = nextArrivalpreformat.format("hh:mm");
            var minutesAway = nextArrivalMinutes - currentMinute;
        }

        $("#n" + i).text(nextArrival);
        $("#m" + i).text(minutesAway);

    }
}
