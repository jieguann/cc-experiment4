/*
 * 
  Controller 
 */

// server variables

// server variables
let dataServer;
let pubKey = 'pub-c-f4f689cd-7936-4cf0-9cd1-46f8070a6e79';
let subKey = 'sub-c-5691f306-e64b-11ea-89a6-b2966c0cfe96';

///generate a random userID
let myID = "phoneSend";



let dataToSend =
{
  rx:0,
  ry:0,
  rz:0
} 


//variables for background color
let bgR = 0;
let bgG = 0;
let bgB = 0;




//name used to sort your messages. used like a radio station. can be called anything
let channelName = "example7";

function setup() 
{
  
  createCanvas(windowWidth,windowHeight);

  
  


   // initialize pubnub
   dataServer = new PubNub(
    {
      publish_key   : pubKey,  //get these from the pubnub account online
      subscribe_key : subKey,  
      ssl: true,  //enables a secure connection. This option has to be used if using the OCAD webspace
      uuid: myID
    });
  


}

function draw() 
{
background(bgR,bgG,bgB);
noStroke();

fill(255);
textAlign(CENTER,CENTER);
textSize(100);
  
///get the current orientation angles of the phone and save it to the data object
//https://p5js.org/reference/#/p5/rotationX
//https://p5js.org/reference/#/p5/rotationY
//https://p5js.org/reference/#/p5/rotationZ  
dataToSend.rx = floor(rotationX);
dataToSend.ry = floor(rotationY);
dataToSend.rz = floor(rotationZ);

  text("RX: "+dataToSend.rx,width/2,height/2-100);
  text("RY: "+dataToSend.ry,width/2,height/2);
  text("RZ: "+dataToSend.rz,width/2,height/2+100);
}


///use device Shaken to send the message
//https://p5js.org/reference/#/p5/deviceShaken
function deviceShaken() 
{
 
  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        dataToSend  
      }
    });

 //change the background to let you know that it worked
bgR = random(255);
bgG = random(255);
bgB = random(255);
  
}


