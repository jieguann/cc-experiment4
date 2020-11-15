let dataServer;
let pubKey = 'pub-c-e22184a4-9a00-4f33-a390-a14bc6bb6cbc';
let subKey = 'sub-c-bae81246-2466-11eb-862a-82af91a3b28d';
let button;
let myID = "sender1";
let touchesX;
let touchesY;
let dataToSend =
{
  touchX:0,
  touchY:0
} 
let channelName = "phone1";

function setup() {
  createCanvas(windowWidth,windowHeight);
  dataServer = new PubNub({
    publish_key   : pubKey, 
    subscribe_key : subKey,  
    ssl: true,
    uuid: myID
  });
}

function draw() {
  background(255);
  noStroke();

  fill(255);
  textAlign(CENTER,CENTER);
  textSize(100);
  for (i = 0; i < touches.length; i++) {
    touchesX=touches[i].x;
    touchesY=touches[i].y;
    stroke(0);
    circle(touchesX,touchesY,40);
  }
  dataToSend.touchX= touchesX;
  dataToSend.touchY= touchesY;  
  dataServer.publish({
    channel: channelName,
    message: dataToSend
  });
}


