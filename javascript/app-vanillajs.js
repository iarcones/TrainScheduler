//USE VANILLA JAVASCRIPT TO FEED THE TABLE WITH TRAINS ROWS

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
var currentMinute =
  parseInt(moment().format("HH")) * 60 + parseInt(moment().format("mm"));

var tablePosition = 0;
var tableTrain = [];

$("#add-train-btn").on("click", function(event) {
  // Prevent form from submitting
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
    console.log(snapshot.val());
    var key = snapshot.key;
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var frequency = parseInt(snapshot.val().frequency);
    var firstTrain = snapshot.val().firstTrain;

    var firstTrainMinute =
      parseInt(moment(firstTrain, "hh:mm").format("HH")) * 60 +
      parseInt(moment(firstTrain, "hh:mm").format("mm"));

    var elapsedTime = parseInt(currentMinute - firstTrainMinute);

    if (elapsedTime < 0) {
      var nextArrival = firstTrain;
      var minutesAway = firstTrainMinute - currentMinute;
    } else {
      var nextArrivalMinutes =
        firstTrainMinute +
        Math.floor(elapsedTime / frequency) * frequency +
        frequency;
      nextArrivalMinutes = parseInt(nextArrivalMinutes);
      var nextArrivalpreformat = moment.duration(nextArrivalMinutes, "minutes");
      var nextArrival = nextArrivalpreformat.format("hh:mm");
      var minutesAway = nextArrivalMinutes - currentMinute;
    }

    // $("#train-table > tbody").append(`<tr><td scope='col'>${ trainName }</td><td scope='col'>${ destination }</td><td class='text-center' scope='col'>${ frequency }</td><td class='text-center' scope='col'>${ nextArrival }</td><td class='text-center' scope='col'id=m${ tablePosition }>${ minutesAway }</td><td scope='col'><button key=${ key } class="btn btn-danger delete">Delete</button></td></tr></tr>`)

    // $("#train-table > tbody").append(`<tr><td scope='col'>${ trainName }</td><td scope='col'>${ destination }</td><td scope='col'class='text-center' id=n${ tablePosition }>${ nextArrival }</td><td scope='col' class='text-center'>${ frequency }</td><td scope='col' class='text-center' id=m${ tablePosition }>${ minutesAway }</td><td scope='col'><button key=${ key } class="btn btn-outline-danger delete content-center">delete</button></td></tr>`)

    // $("#traintable > tbody").append(`<tr><td scope='col'>${trainName}</td><td scope='col'>${destination}</td><td scope='col'class='text-center' >${frequency}</td><td scope='col' class='text-center'>${nextArrival}</td><td scope='col' class='text-center' >${minutesAway}</td><td scope='col'><button key=${key} class="btn btn-outline-danger delete content-center">delete</button></td></tr>`)

    //Create the row element
    var rowTable = document.createElement("tr");

    //Create the column element and add the rest of the attr and text
    var tdRow = document.createElement("td");
    tdRow.setAttribute("scope", "col");
    var text = document.createTextNode(trainName);
    tdRow.appendChild(text);
    rowTable.appendChild(tdRow);

    //Create the column element and add the rest of the attr and text
    var tdRow = document.createElement("td");
    tdRow.setAttribute("scope", "col");
    var text = document.createTextNode(destination);
    tdRow.appendChild(text);
    rowTable.appendChild(tdRow);

    //Create the column element and add the rest of the attr and text
    var tdRow = document.createElement("td");
    tdRow.setAttribute("scope", "col");
    tdRow.setAttribute("class", "text-center");
    var text = document.createTextNode(frequency);
    tdRow.appendChild(text);
    rowTable.appendChild(tdRow);
    var element = document.getElementById("traintable");
    element.appendChild(rowTable);

     //Create the column element and add the rest of the attr and text
    var tdRow = document.createElement("td");
    tdRow.setAttribute("scope", "col");
    tdRow.setAttribute("class", "text-center");
    var text = document.createTextNode(nextArrival);
    tdRow.appendChild(text);
    rowTable.appendChild(tdRow);

    //Create the column element and add the rest of the attr and text
    var tdRow = document.createElement("td");
    tdRow.setAttribute("scope", "col");
    tdRow.setAttribute("class", "text-center");
    var text = document.createTextNode(minutesAway);
    tdRow.appendChild(text);
    rowTable.appendChild(tdRow);

    //Create the column element and add the button
    var tdRow = document.createElement("td");
    tdRow.setAttribute("scope", "col");
    var tButton = document.createElement("button")
    tButton.setAttribute("key", key);
    tButton.setAttribute("class", "btn btn-outline-danger delete content-center");
    var text = document.createTextNode("delete");
    tButton.appendChild(text);
    tdRow.appendChild(tButton);
    rowTable.appendChild(tdRow);

    // Add the row to the table tbody
    var tbody = document.getElementById("traintable");
    tbody.appendChild(rowTable);

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

    if (firstTime === 0) {
      firstTime = 1;
      update = setInterval(updateInfo, 60000);
    }
  },
  function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  }
);

function updateInfo() {
  // pending solve the update without reload the page

  currentTime = moment().format("MM/DD/YYYY - HH:mm");
  $("#current-time").text(currentTime);

  currentMinute =
    parseInt(moment().format("HH")) * 60 + parseInt(moment().format("mm"));

  for (var i = 0; i < tableTrain.length; i++) {
    var firstTrainMinute =
      parseInt(moment(tableTrain[i][0], "hh:mm").format("HH")) * 60 +
      parseInt(moment(tableTrain[i][0], "hh:mm").format("mm"));

    var elapsedTime = parseInt(currentMinute - firstTrainMinute);

    if (elapsedTime < 0) {
      var nextArrival = firstTrain;
      var minutesAway = firstTrainMinute - currentMinute;
    } else {
      var nextArrivalMinutes =
        firstTrainMinute +
        Math.floor(elapsedTime / tableTrain[i][1]) * tableTrain[i][1] +
        tableTrain[i][1];
      nextArrivalMinutes = parseInt(nextArrivalMinutes);

      var nextArrivalpreformat = moment.duration(nextArrivalMinutes, "minutes");
      var nextArrival = nextArrivalpreformat.format("hh:mm");
      var minutesAway = nextArrivalMinutes - currentMinute;
    }

    $("#n" + i).text(nextArrival);
    $("#m" + i).text(minutesAway);
  }
}

console.log("javascript loaded");
// Your web app's Firebase configuration

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAOb6U3wlP12EcHiGByJrbm1cRskHyIb5Y",
  authDomain: "traincyd.firebaseapp.com",
  databaseURL: "https://traincyd.firebaseio.com",
  projectId: "traincyd",
  storageBucket: "",
  messagingSenderId: "723341098159",
  appId: "1:723341098159:web:086d2c8f7eb56f8f52e85a",
  measurementId: "G-QSYBQP8X9B"
};

//
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
var db = firebase.database();

// pass original date in seconds (unix) and rate in minutes
const getNext = (original, rate) => {
  const rateInSeconds = rate * 60;

  const now = moment().unix();

  let lapse = original;

  while (lapse < now) {
    lapse += rateInSeconds;
  }

  return moment(lapse + rate, "X").format("MMMM, Do YYYY hh:mm a");
};

document.getElementById("addTrain").addEventListener("click", function() {
  event.preventDefault();
  console.log("click");
  let train = {
    name: document.getElementById("trainName").value,
    trainDest: document.getElementById("destination").value,
    trainTime: document.getElementById("time").value,
    trainFreq: document.getElementById("frequency").value
  };

  console.log(train);
  db.ref().push(train);
});

db.ref().on("child_added", function(snapshot) {
  console.log(snapshot.key, snapshot.val());

  var key = snapshot.key;
  var trainName = snapshot.val().name;
  var destination = snapshot.val().trainDest;
  var frequency = parseInt(snapshot.val().trainFreq);
  var firstTrain = snapshot.val().trainTime;
  var originseconds = moment.duration(firstTrain).asSeconds();
  console.log("seconds", originseconds);
  var nextArrival = getNext(originseconds, frequency);
  console.log(nextArrival);
  var nowT = moment().unix();
  var next = moment(nextArrival).unix();
  console.log(nowT, next);
  //var minutesAway = moment.duration(nowT.diff(nextArrival));
  //console.log(minutesAway)
  var minutesAway = 0;

  // add to the screnn the info the row
  // you need to calculate the next train and the minites wasy
  // then create a row in the htm table
  //document.getElementById("traintable > tbody" ).appendChild('<tr><td scope="col">#</td><td scope="col">' + trainName + '<///////td><td scope="col">' + destination + '</td><td scope="col">' + frequency + '</td><td scope="col">'  + nextArrival + ' </td><td //scope="col">' + minutesAway + '</td></tr>')
});
