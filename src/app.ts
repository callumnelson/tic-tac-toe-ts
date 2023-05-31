/*-------------------------------- Constants --------------------------------*/

const winningCombos: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

/*---------------------------- Variables (state) ----------------------------*/

let board: number[]
let turn: number, numTurns: number 
let winner: boolean, tie: boolean
let winningCombo: number[]
let playerOneName: string, playerTwoName: string
let playerOneIcon: string, playerTwoIcon: string
let playerOneWins: number = 0, playerTwoWins: number = 0

/*------------------------ Cached Element References ------------------------*/

const squareEls = document.querySelectorAll<HTMLDivElement>('.sqr')
const messageEl = document.querySelector<HTMLHeadingElement>('#message')
const boardEl = document.querySelector<HTMLElement>('.board')
const resetGameBtnEl = document.querySelector<HTMLButtonElement>('#reset-game-button')
const resetScoreBtnEl = document.querySelector<HTMLButtonElement>('#reset-score-button')
const saveSettingsBtnEl = document.querySelector<HTMLButtonElement>('#save-settings-button')
const resetSettingsBtnEl = document.querySelector<HTMLButtonElement>('#reset-settings-button')
const playerOneScoreEl = document.querySelector<HTMLHeadingElement>('#p1-score')
const playerTwoScoreEl = document.querySelector<HTMLHeadingElement>('#p2-score')
const playerOneNameEl = document.querySelector<HTMLInputElement>('#p1-name-input')
const playerTwoNameEl = document.querySelector<HTMLInputElement>('#p2-name-input')
const playerOneIconEl = document.querySelector<HTMLSelectElement>('#p1-icon-select')
const playerTwoIconEl = document.querySelector<HTMLSelectElement>('#p2-icon-select')
const playerOneScoreHeaderEl = document.querySelector<HTMLParagraphElement>('#p1-score-header')
const playerTwoScoreHeaderEl = document.querySelector<HTMLParagraphElement>('#p2-score-header')

/*----------------------------- Event Listeners -----------------------------*/

boardEl?.addEventListener('click', handleClick)
resetGameBtnEl?.addEventListener('click', handleGameReset)
resetScoreBtnEl?.addEventListener('click', handleScoreReset)
saveSettingsBtnEl?.addEventListener('click', handleSettingsSave)
resetSettingsBtnEl?.addEventListener('click', handleSettingsReset)

/*-------------------------------- Functions --------------------------------*/

//Event listeners
function handleClick(evt: MouseEvent): void {
  if (!(evt.target instanceof HTMLElement)) return
  let clickedClass = evt.target.className  
  if (clickedClass !== 'sqr') return
  //Extract index and convert to integer
  let sqIdx = parseInt(evt.target.id.replace('sq', ''))
  if(board[sqIdx] || winner) return
  placePiece(sqIdx)
  checkForTie()
  checkForWinner()
  updatePlayerWins()
  switchPlayerTurn()
  render()
}

function handleGameReset(): void {
  init()
}

function handleScoreReset(): void {
  if (!playerOneScoreEl?.textContent || !playerTwoScoreEl?.textContent) return
  playerTwoWins = 0
  playerOneWins = 0
  playerOneScoreEl.textContent = '0'
  playerTwoScoreEl.textContent = '0'
}

function handleSettingsSave(): void {
  changeNames()
  updateNames()
  changeIcons()
  updateBoard()
}

function handleSettingsReset(): void {
  if (!playerOneNameEl?.value || !playerOneIconEl?.value || !playerTwoNameEl?.value || !playerTwoIconEl?.value) return

  playerOneNameEl.value = 'Player X'
  playerTwoNameEl.value = 'Player O'
  playerOneIconEl.value = 'X'
  playerTwoIconEl.value = 'O'
  changeNames()
  updateNames()
  changeIcons()
  updateBoard()
}

//Gameplay functions
function placePiece(idx: number): void {
  board[idx] = turn
}

function checkForTie(): void {
  if(!board.includes(0)) tie = true
}

function checkForWinner(): void {
  for (let combo of winningCombos){
    let sum = 0
    combo.forEach(sqrIdx => {
      sum += board[sqrIdx]
    })
    Math.abs(sum) === 3 ? winner = true : winner = false
    if (winner){
      winningCombo = combo
      return 
    }
  }
}

function updatePlayerWins(): void {
  if (!playerOneScoreEl?.textContent || !playerTwoScoreEl?.textContent) return

  if(winner){
    if (turn === 1){
      playerOneWins += 1
      playerOneScoreEl.textContent = `${playerOneWins}`
    } else {
      playerTwoWins += 1
      playerTwoScoreEl.textContent = `${playerTwoWins}`
    }
  }
}

function switchPlayerTurn(): void {
  if (winner) return
  else turn *= -1
}

//Update functions
function updateBoard(): void {
  board.forEach( (square, index) => {
    let squareEl = squareEls[index]
    square ? (square > 0 ? squareEl.textContent = playerOneIcon : squareEl.textContent = playerTwoIcon) : squareEl.textContent = null
    
    if(winner){
      //Highlight the winning combination if there is a winner
      if(winningCombo.includes(index)){
        squareEl.style.backgroundColor = 'lightgreen'
        squareEl.style.color = 'white'
      }else{
        squareEl.style.backgroundColor = 'white'
      }
    }
  })
}

function updateMessage(): void {
  if (!messageEl?.innerHTML) return

  if(!winner && !tie){
    messageEl.innerHTML = `It's ${turn > 0 ? playerOneName : playerTwoName}'s turn.` 
  } else if (!winner && tie){
    messageEl.textContent = `It's a tie!`
  } else {
    messageEl.innerHTML = `${turn > 0 ? playerOneName : playerTwoName} wins!`
  }
}

function updateNames(): void {
  // If player saved settings with empty name, reset to default
  if (!playerOneNameEl?.value || !playerTwoNameEl?.value) return
  if (!playerOneScoreHeaderEl?.textContent || !playerTwoScoreHeaderEl?.textContent) return

  if(!playerOneNameEl.value) playerOneNameEl.value = playerOneName
  if(!playerTwoNameEl.value) playerTwoNameEl.value = playerTwoName
  playerOneScoreHeaderEl.textContent = `${playerOneName} Wins:`
  playerTwoScoreHeaderEl.textContent = `${playerTwoName} Wins:`
  updateMessage()
}

function changeNames(): void {
  if (!playerOneNameEl?.value || !playerTwoNameEl?.value) return

  playerOneName = playerOneNameEl.value ? playerOneNameEl.value : 'Player X'
  playerTwoName = playerTwoNameEl.value ? playerTwoNameEl.value : 'Player O'
}

function changeIcons(): void {
  if (!playerOneIconEl?.value || !playerTwoIconEl?.value) return
  
  playerOneIcon = playerOneIconEl.value
  playerTwoIcon = playerTwoIconEl.value
}

//Initial setup functions
function setTie(): void {
  tie = false
}

function setWinner(): void {
  winner = false
}

function setTurn(): void {
  turn = 1
}

function setBoard(): void {
  winningCombo = []
  board = []
  numTurns = 0
  for (let i = 0; i < 9; i++){
    board.push(0)
  }
}

function setNames(): void {
  if (!playerOneNameEl?.value || !playerTwoNameEl?.value) return
  playerOneName = playerOneNameEl.value
  playerTwoName = playerTwoNameEl.value
}

function setIcons(): void {
  if (!playerOneIconEl?.value || !playerTwoIconEl?.value) return
  playerOneIcon = playerOneIconEl.value
  playerTwoIcon = playerTwoIconEl.value
}

function setBoardFormat(): void {
  squareEls.forEach( (square: HTMLDivElement) => {
    square.style.backgroundColor = 'transparent'
    square.style.color = 'black'
  })
}

function render(): void {
  updateBoard()
  updateMessage()
}

function init(): void {
  setBoard()
  setBoardFormat()
  setTurn()
  setWinner()
  setTie()
  setNames()
  setIcons()
  render()
}

init()