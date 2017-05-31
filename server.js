console.log('server is starting');

//setting up express, bodyparser
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = app.listen(3000, listening);

function listening(){
  console.log("Listening....");
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//for reading the file and setting the active database.
var fs = require("fs");
var data = fs.readFileSync("final.json");

//parsing the data from the file into JSON object.
var weights = JSON.parse(data);

// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

//post data.
app.post('/addP', addDatas);
//this function adds data to the active database.
//todo: save file.

function addDatas (request, response){
  console.log(request.body); // this always returns {} -- WHY!
  var date = request.body.date;
  //enter error handling for dates/weights/attended - or leave it at client side?
  var weight = request.body.weight;
  var attended;

  if(request.body.bjj == "true"){
      attended = true;
  }else{
      attended = false;
  }
  var newData = {
    weight: Number(weight),
    bjj: attended
  }

  weights[date] = newData



  // confirm back to the server that new data has been added.
  var reply = {
    msg: "New data added",
    date: date,
    weight: weight,
    bjj: attended
  }
  response.send(reply);
  var writeData = JSON.stringify(weights, null, 2);
  fs.writeFile("final.json",writeData, writeComplete);
  function writeComplete(){
    console.log("Server File Updated");
  }

}




//sending all data to the client.
app.get("/all", sendAll);
function sendAll(request, response){
  response.send(weights);
  console.log("sent data");
}


//searching the json data with path
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









// //This is outdated code that adds weight/attendance in get requests - not good!
//
// app.get("/add/:date/:weight/:attended", addWeight);
// function addWeight (request, response){
//
//   var data = request.params;
//   var date = data.date;
//   //enter error handling for dates.
//   var weight = data.weight;
//   var attended = data.attended;
//   //ender error handling for weights
//   weights[date].weight = Number(weight);
//
//   if(attended == "true"){
//       weights[date].bjj = true;
//   }else{
//       weights[date].bjj = false;
//   }
//
//   var reply = {
//     msg: "New data added",
//     date: date,
//     weight: weight,
//     bjj: attended
//   }
//   response.send(reply);
// }
