// touch screen listener

let dataServer;
let pubKey = 'pub-c-e22184a4-9a00-4f33-a390-a14bc6bb6cbc';
let subKey = 'sub-c-bae81246-2466-11eb-862a-82af91a3b28d';
let myID = "receiver";
let dataReceived = [];
let channelName = "phone1";

function setup() {
  dataServer = new PubNub({
    subscribe_key : subKey,  
    ssl: true,  
    uuid: myID
  });
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});
}

function draw() {
  createCanvas(windowWidth,windowHeight);
  background(0);
  if(dataReceived.length>0){
    let lastMessageReceived = dataReceived.length-1;
  }
  for(let i=0;i<dataReceived.length;i++){
    stroke(255);
    circle(dataReceived[i].message.touchX,dataReceived[i].message.touchY,20);
  }
}

function readIncoming(inMessage){ 
  console.log(inMessage);
  dataReceived.push(inMessage);
}
