var allData;
var userDate;
var userWeight;
var userAttended;

function preload(){
}

function setup(){
  //createCanvas(400,400);
  //background(51);
  reloadData();
  console.log("Running...")
}
function reloadData(){
  loadJSON("/all", gotData);
}

function gotData(data){
  console.log("Got all Data...");
  allData=data;
  console.log(allData);
  var uYear = select("#uyear");
  var uDay = select("#uday");
  var uMonth = select("#umonth");
  var submit = select("#submit");
  var view = select("#view");
  var uWeight = select("#weight");
  var uAttendance = select("#attendance");

  submit.mousePressed(setValues);
  view.mousePressed(showValues);

  function setValues(){
    userDate = uYear.value() +"-"+uMonth.value()+"-"+uDay.value();
    userWeight = uWeight.value();
    if (uAttendance.value()=="yes"){
        userAttended = true;
    }else{
      userAttended = false;
    }
    loadJSON("/add/"+userDate+"/"+userWeight, finished);
    function finished(data){console.log(data);reloadData();}

  }



  function showValues(){
    var viewP = select("#viewData");
    viewP.html("");
    var keys = Object.keys(allData);
    for (var i =0; i<keys.length;i++){

      var line = "Date: " + keys[i] + " Weight: " + allData[keys[i]].weight;
      if (allData[keys[i]].bjj){
        line += " attended: yes "
      }else{
        line += " attended: no "
      }
      line+="</br>"
      viewP.html(line, true);
    }

  }



}
