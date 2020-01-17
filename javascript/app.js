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
var counterRefresh = 0;
var firstTime = 0;
var currentTime = moment().format("MM/DD/YYYY - HH:mm");
$("#current-time").text(currentTime);


var update = setInterval(updateInfo, 60000);

$("#add-train-btn").on("click", function(event) {
  // Prevent form from submittingdb.
  event.preventDefault();

  $("#error-text").text("");

  // Get the input values
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var destination = $("#destination-input")
    .val()
    .trim();
  var firstTrain = $("#first-train-input")
    .val()
    .trim();
  var frequency = parseInt(
    $("#frequency-input")
      .val()
      .trim()
  );

  if (
    trainName === "" ||
    destination === "" ||
    firstTrain === "" ||
    frequency === ""
  ) {
    $("#error-text").text(
      "<--- All fields are mandatory, please complete the form --->"
    );
    return;
  }

  // validate first train input datatype and frequency
  if (!Number.isInteger(frequency)) {
    console.log("error frequency");
    $("#error-text").text("Please enter valid frequency");
    return;
  }

  // validate military date with moment.js and control that is not 24:mm

  var validDate = moment(firstTrain, "HH:mm", true).isValid();
  console.log("validDate: ", validDate);

  if (!validDate) {
    console.log("error not all the inputs");
    $("#error-text").text("Please enter valid first train format");
    return;
  }
  if (parseInt(firstTrain.split(":")[0]) === 24) {
    console.log("error not all the inputs");
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
database.ref().on(
  "child_added",
  function(snapshot) {
    var key = snapshot.key;
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = parseInt(snapshot.val().frequency);

    // calculateNext return the nextTrain and the minutesAway
    var data = calculateNext(snapshot.val().firstTrain, frequency)

    $("#train-table > tbody").append(
      `<tr class="trains"><td scope='col'>${trainName}</td><td scope='col'>${destination}</td><td scope='col'class='text-center frequency' frequency=${frequency}>${frequency}</td><td scope='col' class='text-center next' firsttrain=${snapshot.val().firstTrain}>${data[0]}</td><td scope='col' class='text-center minutes'>${data[1]}</td><td scope='col'><button key=${key} class="btn btn-outline-danger delete content-center">delete</button></td></tr>`
    );

    $(".delete").on("click", function(event) {
      event.preventDefault();

      // GET THE DB KEY OF THE TRAIN TO BE DELETED
      var key = $(this).attr("key");

      // EMPTY THE TR ROW
      $(this)
        .parent()
        .parent()
        .empty();

      // DELETE THE TRAIN FROM THE DB
      database
        .ref()
        .child(key)
        .remove();
    });

  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

function updateInfo() {
    

    $(".trains").each(function(){

        var frequency = $(this).children(".frequency").attr("frequency")
        var firstTrain = $(this).children(".next").attr("firsttrain")

        var data = calculateNext(firstTrain, frequency)

        $(this).children(".next").text(data[0])
        $(this).children(".minutes").text(data[1])

    })
  }

function calculateNext(firstTrain, frequency){
    console.log(firstTrain, frequency)
    var currentTime = moment().format("MM/DD/YYYY - HH:mm");
    $("#current-time").text(currentTime);

    var firstTrain = moment(firstTrain, "HH:mm:ss");

    var minutesAway =
      frequency - ((moment().diff(firstTrain, "minutes") % frequency));

    if (moment() < moment(firstTrain)) {
      miliseconds = moment(firstTrain).diff(moment());
      minutesAway = Math.ceil(miliseconds / 60000);
    }

    var nextArrival = moment()
      .add(minutesAway, "minutes")
      .format("hh:mm A");

    return([nextArrival,minutesAway])
}