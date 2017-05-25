var weightJson;

function preload(){
}

function setup(){
  //createCanvas(400,400);
  //background(51);
  loadJSON("/all", gotData);
  console.log("Running...")
}

function gotData(data){
  console.log(data);
}
