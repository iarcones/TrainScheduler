# TrainScheduler

Train scheduler, input data: train name, first train, frequency.
Calculate next arrival and minutes away from the current time.
Added timer to update next arrival and minutes away every minute.

Visit here: https://iarcones.github.io/TrainScheduler/

# Built With
HTML Bootstrap Javascript jQuery  Firebase momento.js

# Code snippet

```javascript
// solution not used, manipulating the string
    var firstTrainMinute = (parseInt((firstTrain.slice(0, 2))) * 60) + parseInt(firstTrain.slice(3, 5));
// solution used to calculate minutes from midnight with moment.js)
     var firstTrainMinute = (parseInt(moment(firstTrain, "hh:mm").format("HH")) * 60) + parseInt(moment(firstTrain, "hh:mm").format("mm"));

```
# Authors
Isabel Arcones

# Comments
First project using Firebase

# Acknowledgments
