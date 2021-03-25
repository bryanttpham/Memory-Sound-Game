//Global constants
const clueHoldTime= 1000; //How long to ghold each clue's light/sound
const cluePauseTime =150;
const nextClueWaitTime=300;

//Global Variables
var pattern=[2,2,4,3,2,1,2,4];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter=0;


function startGame()
{
//intialize game variables
  progress=0;
  gamePlaying =true;
  //swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function endGame()
{
  //intialize game variables
  gamePlaying=false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn)
{
  if(gamePlaying)
  {

    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence()
{
  guessCounter=0;
  let delay= nextClueWaitTime;
  for(let i=0;i<=progress;i++)
  {  
    console.log("play single clue: "+ pattern[i] +" in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]);
    delay+=clueHoldTime;
    delay+=cluePauseTime;
  }
}

function loseGame()
{
  endGame();
  alert("Game Over.You Lost.")
  
}

function winGame()
{
  endGame();
  alert("GameOver. You Won!")
  
}

function guess(btn)
{
  console.log("user guessed: " + btn)
  
  //is game being played
  if(!gamePlaying)
    {
      return;
    }
  
  //is the button the correct button
   if(pattern[guessCounter] == btn) {
     //two options: should game end or should guess counter increment and playClueSequence carried out
    if (guessCounter == progress) {
      //if last tone was played and lit up game was won
      if (progress == pattern.length - 1) {
        winGame();
      }
      //game is not over playClueSequence is carried out and guessCounter is intialized to 0
      else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    loseGame();
  }
}





