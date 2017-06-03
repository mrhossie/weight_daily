//initializing variables - is this needed??

var allData;
var userDate;
var userWeight;
var userAttended;
var uYear;
var uDay;
var uMonth;
var submit;
var view;
var analysis;
var analysisParagraph;
var uWeight;
var uAttendance;
var viewP;
var parag;


//preload function for the sketch library - this isnt really needed unless you dont want to use async methonds.
function preload() {}

//setup function for the p5js sketch.
function setup() {
  //var cnv=  createCanvas(800,400);
  //cnv.parent('canvas');
  //background(51);

  //selecting DOM elements.
  viewP = select("#viewData");
  parag = select("#selectList");
  uDate = select("#udate");
  submit = select("#submit");
  view = select("#view");
  analysis = select("#analysis");
  analysisParagraph = select("#analysisParagraph");
  uWeight = select("#weight");
  uAttendance = select("#attendance");
  //load data from server.
  reloadData();
  console.log("Running...");
  //hooks to catch mouse pressed events on the buttons.
  submit.mousePressed(setValues);
  view.mousePressed(showValues);
  analysis.mousePressed(analyzeData);

  parag.changed(doAThing);
  function doAThing(){
    var selectResult = select("#selectResult");
    var keys = Object.keys(allData);
    var beforeWeight = allData[parag.value()].weight;
    var afterWeight = allData[parag.value()].weight;
    var currentWeight = allData[parag.value()].weight;
    var bjj = "No";

    for (var i = 0; i < keys.length; i++) {
      if (keys[i]==parag.value()){
        if (i == 0){
          afterWeight = allData[keys[i+1]].weight;

        } else if (i == keys.length-1){
          if (allData[keys[i-1]].bjj){
            bjj = "Yes";
          }else{
            bjj = "No";
          }
          beforeWeight = allData[keys[i-1]].weight;

        }else{
          beforeWeight = allData[keys[i-1]].weight;
          afterWeight = allData[keys[i+1]].weight;
          if (allData[keys[i-1]].bjj){
            bjj = "Yes";
          }else{
            bjj = "No";
          }

        }
          break;
        }
      }


    selectResult.html("Current Weight: " + currentWeight + "lbs");
    selectResult.html("<br>BJJ Night Before? "+ bjj, true);
    selectResult.html("<br>Weight Change from Yesterday: "+ (currentWeight-beforeWeight)+ "lbs", true);
    selectResult.html("<br>Weight Change day after: "+ (afterWeight -currentWeight)+ "lbs", true);

  }

}


//this functions loads the data from the JSON object on server
function reloadData() {

  loadJSON("/all", gotData);
  console.log("Data reloaded...");

}

//call back function from the get call above, then shows all values.
function gotData(data) {
  console.log("Got all Data...");
  allData = data;
  showValues();
}

//this function sets values for the variables when the submit button is pushed.
function setValues() {
  userDate = uDate.value();

  if (!uWeight.value() && allData[userDate]) {
    //updating a weight if the date entry exists.
    userWeight = allData[userDate].weight;
  }else if(!uWeight.value()){
      //ERROR that date needs a weight at least!
      var msg = "ERROR!"
      alert("Please Enter weight");
      return msg;
  } else {
    userWeight = uWeight.value();
  }

  if (!uAttendance.value()) {
    userAttended = allData[userDate].bjj;
  } else if (uAttendance.value() == "yes") {
    userAttended = true;
  } else if (uAttendance.value() == "no") {
    userAttended = false;
  }

  //the JSON object to be added to the server

  var r = {
    date: userDate,
    weight: userWeight,
    bjj: userAttended


  };
  // had to resort to jQuery library to handle post request.
  $.post("/addP", r, finished);


  //httpPost("/addP","json",r, finished); // round trip works, but no data is sent?.
  //loadJSON("/add/" + userDate + "/" + userWeight + "/" + userAttended, finished); //not smart.

}
// call back for the post request - console logs the reply from server then reloads the new data.
function finished(d) {
  console.log(d);
  reloadData();
}

function clearFields() {
  //this happens in setValues to clear all fields.
}

//this lists all the values in the data.
//need to find a better way to display this on the page.
function showValues() {

  parag.html("");
  viewP.html("");
  var keys = Object.keys(allData);

  for (var i = keys.length-1; i > 0; i--) {

    var line = "Date: " + keys[i] + " Weight: " + allData[keys[i]].weight;
    if (allData[keys[i]].bjj) {
      line += " attended: yes "
    } else {
      line += " attended: no "
    }

    var x = createElement("option", keys[i]);
    x.value(keys[i]);
    x.parent(parag);
    line += "</br>";
    viewP.html(line, true);
  }

}

//work in progress to start data analysis.
function analyzeData() {
  var keys = Object.keys(allData);
  var initialWeight = allData[keys[0]].weight;
  var currentWeight = allData[keys[keys.length - 1]].weight;
  analysisParagraph.html("Total Weight Loss: " + (initialWeight - currentWeight) + "lbs");
  analysisParagraph.html("</br>Average Daily Weight Loss: " + averageWeightLoss(keys) + "lbs", true);
  graphIt(keys);
}

function averageWeightLoss(k) {
  var averageWeightLossValue = 0;
  for (var i = 0; i < k.length; i++) {
    if (i != 0) {
      var weightLoss = allData[k[i]].weight - allData[k[i-1]].weight;
      averageWeightLossValue += weightLoss;
      averageWeightLossValue /= 2;
    }
  }
  return Math.abs(roundValue(averageWeightLossValue, 2));
}

function graphIt(k){
//zzz

}


function roundValue(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
