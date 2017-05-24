var weightJson;

function preload(){

  weightJson = loadJSON("weight_copy.json");
}

function setup(){
  noCanvas();

  var date = "2017-05-25";
  var json = {};
  json[date] = {};
  json[date].Weight = 250;


}
