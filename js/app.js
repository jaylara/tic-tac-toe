
var currentPlayer = "X";
var turns = 0;
var winsX = 0;
var winsO = 0;
var ties = 0;

var cells = [...document.querySelectorAll('#board .box')];
//var cells = [].slice.apply(document.getElementsByClassName('box'));
var gameLog = document.querySelector("#game-log");
var winConditions = [
  "1,2|3,6|4,8",      //0 corner (even)
  "0,2|4,7",          //1 middle cross (odd)
  "1,0|5,8|4,6",      //2 corner (even)
  "0,6|4,5",          //3 middle cross (odd)
  "3,5|1,7|0,8|2,6",  //4 (middle)
  "2,8|4,3",          //5 middle cross (odd)
  "7,8|3,0|4,2",      //6 corner (even)
  "4,1|6,8",          //7 middle cross (odd)
  "7,6|4,0|5,2"       //8 corner (even)
];

//convert each set of win conditions into convenient arrays
for(var cnt = 0; cnt < winConditions.length; cnt++) {
  var tmpArr = winConditions[cnt].split("|");
  for(var i = 0; i < tmpArr.length ; i++)
    tmpArr[i]  = tmpArr[i].split(",");
  winConditions[cnt] = tmpArr;
}

cells.forEach(function(cell,index) {
  cell.addEventListener('click', function(event) {
    if(turns >= 9)  return;

    var winCondition = winConditions[index];
    var col = (index%3)+1;
    var row = Math.floor(index/3)+1;

    turns++;

    if(cell.innerText.trim().length !== 0) return;

    cell.className += ` box-player${currentPlayer}`;
    cell.innerHTML=`${currentPlayer}`;
    cell.innerText = cell.innerText.trim();

    WriteGameLog(currentPlayer,`Placed piece on [${Math.floor(index/3)+1}, ${(index%3)+1}]`);

    if (turns >= 5) {
      //loop through all winConditions from a particular index
      var winCounter = 0;
      for(var i = 0; i < winCondition.length; i++) {
        for(var c = 0;c < winCondition[i].length;c++)
          if(cells[winCondition[i][c]].innerText !== currentPlayer) break;
        if(c === 2) {
          for(var c = 0;c < winCondition[i].length;c++)
            SetWin(cells[winCondition[i][c]]);
          SetWin(cell);
          winCounter++;
        }//end of if(c)
      }//end of for(winCondition)

      DisplayWin(currentPlayer,winCounter);
    }//end of if(turns)
    SwitchPlayer();
  });
});

function SetWin(box) {
  box.className += " box-win";
} // end of SetWin()

function WriteGameLog(player,message) {
  gameLog.value += (player.length === 0? "GAME":player)+": "+message+"\n";
} // end of WriteGameLog()

function DisplayWin(winner,times) {

  if(times === 0)  {
    if (turns === 9) {
      WriteGameLog("",`No more turns! Game is a TIE!!`);
      WriteGameLog("",`Press 'RESET' to start a new game`);
      ties++;
      document.getElementById('ties').textContent = ties;
      return;
    }
  return;
  }

  turns = 9;
  if(times === 2)
    WriteGameLog("",`Player ${winner} wins a double!!`);
  else if(times === 1)
    WriteGameLog("",`Player ${winner} wins!!`);

  switch(winner) {
    case "X": winsX += times; break;
    case "O": winsO += times; break;
  }

  document.getElementById('wins-X').textContent = winsX;
  document.getElementById('wins-O').textContent = winsO;

  WriteGameLog("",`Press 'RESET' to start a new game`);
} // end of DisplayWin()

function ResetBoard() {
  for(var i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
    cells[i].className = "box";
  }
  currentPlayer = "X";
  turns = 0;
} // end of ResetBoard()

function SwitchPlayer() {
  return currentPlayer = (currentPlayer === "X"?"O":"X");
} // end of SwitchPlayer()
