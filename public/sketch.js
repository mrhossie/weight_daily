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

//preload function for the sketch library - this isnt really needed unless you dont want to use async methonds.
function preload() {}

//setup function for the p5js sketch.
function setup() {
  //createCanvas(400,400);
  //background(51);

  //selecting DOM elements.
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

  if (!uWeight.value()){
    userWeight = allData[userDate].weight;
  }else{
    userWeight = uWeight.value();
  }

  if(!uAttendance.value()){
    userAttended = allData[userDate].bjj;
  }else if (uAttendance.value() == "yes") {
    userAttended = true;
  } else if (uAttendance.value() == "no"){
    userAttended = false;
  }

  //the JSON object to be added to the server
  var r = {
      date: userDate,
      weight: userWeight,
      bjj : userAttended


  };
  // had to resort to jQuery library to handle post request.
  $.post("/addP",r,finished);


  //httpPost("/addP","json",r, finished); // round trip works, but no data is sent?.
  //loadJSON("/add/" + userDate + "/" + userWeight + "/" + userAttended, finished); //not smart.

}
// call back for the post request - console logs the reply from server then reloads the new data.
function finished(d) {
  console.log(d);
  reloadData();
}
function clearFields(){
  //this happens in setValues to clear all fields.
}

//this lists all the values in the data.
//need to find a better way to display this on the page.
function showValues() {
  var viewP = select("#viewData");
  viewP.html("");
  var keys = Object.keys(allData);

  for (var i = 0; i < keys.length; i++) {

    var line = "Date: " + keys[i] + " Weight: " + allData[keys[i]].weight;
    if (allData[keys[i]].bjj) {
      line += " attended: yes "
    } else {
      line += " attended: no "
    }
    line += "</br>"
    viewP.html(line, true);
  }

}

//work in progress to start data analysis.
function analyzeData(){
  var keys = Object.keys(allData);
  var initialWeight = allData[keys[0]].weight;
  var currentWeight = allData[keys[keys.length-1]].weight;
  analysisParagraph.html("Total Weight Loss: "+(initialWeight-currentWeight)+"lbs");
}
