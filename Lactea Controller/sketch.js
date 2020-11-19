// Source: https://p5js.org/reference/#/p5/touchEnded

const balls = [];
var button;
let imgs = [];
let stage = 0;
let titleFont;
let subtitleFont;

const uuid = PubNub.generateUUID();
const pubnub = new PubNub({
  publishKey: "pub-c-f0dbd9a4-2575-4aa5-927a-ad934ca24413",
  subscribeKey: "sub-c-9b4f1122-295d-11eb-9c54-32dcb901e45f",
  uuid: uuid,
  origin: 'pubsub.pubnub.com',
  ssl: true
});

//load stage image of plant

function preload(){
  titleFont=loadFont("TragicMarker.ttf");
  subtitleFont= loadFont('TragicMarker.ttf');
  imgs.push(loadImage('lactea1.png'))
  imgs.push(loadImage('lactea2.png'))
  imgs.push(loadImage('lactea3.png'))
  imgs.push(loadImage('lactea4.png'))
  imgs.push(loadImage('lactea5.png'))
  waterbtn = loadImage('waterbtn.png');
}


//controller value
let CircleLocation;
let CircleAcc;
let CircleSpeed;
let RectCentre;
let RectCentre_c;
//let button;
let status;
let ClickWater;
let longRect;
let circleR;
let centreRectD;

function setup() {
  //control setup
  status = 1;
  circleR =15;
  centreRectD = 20;
  //draw status bar
  CircleLocation = createVector(200,windowHeight*0.3);
  CircleSpeed =8;
  CircleAcc =CircleSpeed;
  longRect = createVector(150,windowWidth-300);
  RectCentre = createVector(windowWidth/2-100,200);
  RectCentre_c = createVector(windowWidth/2-100,200);
  
  createCanvas(windowWidth, windowHeight);
    pubnub.subscribe({
    channels: ['pubnub_onboarding_channel'],
    withPresence: true
  });
   pubnub.addListener({
    message: function(event) {
      console.log('[MESSAGE: received]',
        event.message.sender + ': ' + event.message.value);
    }
  });

  const name = 'sp'+stage+'.png'
  console.log(name);
  button = createImg('waterbtn.png');
  button.position(windowWidth*0.44, windowHeight*0.85);
  button.size(waterbtn.width*0.5, waterbtn.height*0.5)
  button.touchEnded(changeBG);
  
}

function draw() {
  //draw canvas background
  background(255,255,255);
  strokeWeight(1);
  for (var i = 0; i < windowWidth; i +=20) {
     stroke(i/3,240,74);
     line(i, 0, i, windowHeight); 
  }
  for (i = 0; i< windowHeight; i+=20){
    stroke(i/5,240,74);
    line(windowWidth, i, 0, i);
  }
  const plant = imgs[stage];
  image(plant, windowWidth/2-plant.width/2-30 , windowHeight*0.85-532-100 );

 // title
  noStroke();
  textFont(titleFont);
  fill(100,154,61);
  textAlign(CENTER);
  textSize(90);
  text("Virtual Garden",width/2,height*0.15);
 // subtitle
  textFont(subtitleFont);
  fill("#2c4c15");
  textSize(50);
  text("Euphorbia lactea",width/2,height*0.22);
  
  //controller shape
 noStroke();
  fill(159, 221, 252);
  rect(longRect.x, CircleLocation.y-circleR/2, longRect.y, circleR, 20);
  //centrel rect

  DrawRectCentre();
  DrawCircle();
  
 
  //water animation
  for (let b of balls)  b.script();
  document.title = '# Balls: ' + balls.length;
}

 //pushBall();
function DrawCircle(){ 
  noStroke();
  fill(255);
  ellipse(CircleLocation.x, CircleLocation.y, circleR, circleR);
  if(CircleLocation.x > longRect.x+longRect.y+circleR/2){
    CircleAcc = -CircleSpeed;
  }
  if(CircleLocation.x < longRect.x+circleR/2){
    CircleAcc = CircleSpeed;
  }
  CircleLocation.x = CircleLocation.x +CircleAcc; 
}

function DrawRectCentre(){
  fill('#8DDC41');
  rect(RectCentre.x, CircleLocation.y-circleR/2, RectCentre.y, circleR, 20);
  // console.log(CircleLocation.x, RectCentre_c.y+circleR/2);
}


function pushBall(){
  for (let i=0;i<10;i++){
    balls.push( new Ball() );
  }  
} 


class Ball {
  constructor() {
    this.x = random(width/4,width-width/4);
    this.y = random(0,windowHeight/4);
    this.spX = 10;
    this.spY = 10;
    this.alpha = random(100,200);
  }
 
  script() {
    this.bump();
    this.show();
  }
 
  bump() {
    this.y += this.spY ;
    this.alpha = this.alpha -2;
  }
 
  show() {
    noStroke();
    fill(0, 204, 255,this.alpha);
    ellipse(this.x, this.y, Ball.DIAM, Ball.DIAM);
  }
}
 
Ball.DIAM = 20, Ball.RAD = Ball.DIAM >> 1;
Ball.MIN_SPD = 1, Ball.MAX_SPD = 5 + 1;
Ball.COLOUR = 'yellow';


function changeBG() {
  stage = (stage+1)%5;
  pushBall();
  if (stage == 0){
    console.log("RESET !!!");
    RectCentre.x = RectCentre_c.x;
    RectCentre.y = RectCentre_c.y;
    console.log(RectCentre_c)
  }else{
  RectCentre.x = RectCentre_c.x+stage*centreRectD;
  RectCentre.y = RectCentre_c.y -stage*centreRectD*2;
  }
  console.log(RectCentre);
   pubnub.publish({
    channel : 'pubnub_onboarding_channel',
    message : {coralCactus : stage+1}
  },
  function(status, response) {
    if (status.error) {
      console.log(status)
      console.log(response);
    }
    else {
      console.log('[PUBLISH: sent]',
        'timetoken: ' + response.timetoken);
    }
     console.log("STATUS:", status, "RESPONSE:", response)
  })
}