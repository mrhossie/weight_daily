console.log('server is starting');

var express = require('express');
var app = express();
var server = app.listen(3000, listening);

function listening(){
  console.log("Listening....");
}

app.use(express.static('public'));


var fs = require("fs");
var data = fs.readFileSync("final.json");

var weights = JSON.parse(data);


app.get("/all", sendAll);
function sendAll(request, response){
  response.send(weights);
  console.log("sent data");
}

//hi

app.get("/add/:date/:weight", addWeight);
function addWeight (request, response){

  var data = request.params;
  var date = data.date;
  //enter error handling for dates.
  var weight = data.weight;
  //ender error handling for weights
  weights[date].weight = Number(weight);
  var reply = {
    msg: "New weight added"
  }
  response.send(reply);
}

app.get("/search/:date", searchDate);
function searchDate(request, response){
  var date = request.params.date;
  var reply;
  if(weights[date]){
    reply = {
      status: "found",
      date: date,
      data: weights[date]

    }
  } else{
    reply = {status: "date not found"}
  }
  response.send(reply);

}

app.get("/add/:date/:attended", addAttended);
function addAttended (request, response){

  var data = request.params;
  var date = data.date;
  //enter error handling for dates.
  var attended = data.attended;
  //ender error handling for attendance
  if(attended == "yes"){
      weights[date].bjj = true;
  }else{
      weights[date].bjj = false;
  }

  var reply = {
    msg: "Attendance noted"
  }
  response.send(reply);
}
