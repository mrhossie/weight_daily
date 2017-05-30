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

function preload() {}

function setup() {
  //createCanvas(400,400);
  //background(51);
  uDate = select("#udate");
  submit = select("#submit");
  view = select("#view");
  analysis = select("#analysis");
  analysisParagraph = select("#analysisParagraph");
  uWeight = select("#weight");
  uAttendance = select("#attendance");
  reloadData();
  console.log("Running...")
  submit.mousePressed(setValues);
  view.mousePressed(showValues);
  analysis.mousePressed(analyzeData);
}



function reloadData() {
  loadJSON("/all", gotData);
  console.log("Data reloaded...")

}

function gotData(data) {
  console.log("Got all Data...");
  allData = data;
  showValues();
}

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
  var r = {data:"this is data"};

  httpPost("/addP", r, "json", finished);
  //loadJSON("/add/" + userDate + "/" + userWeight + "/" + userAttended, finished);

}

function finished(d) {
  console.log(d);
  reloadData();
}
function clearFields(){
  //this happens in setValues to clear all fields.
}


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

function analyzeData(){
  var keys = Object.keys(allData);
  var initialWeight = allData[keys[0]].weight;
  var currentWeight = allData[keys[keys.length-1]].weight;
  analysisParagraph.html("Total Weight Loss: "+(initialWeight-currentWeight)+"lbs");
}
