"use strict";
/*-------------------------------- Constants --------------------------------*/
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
/*---------------------------- Variables (state) ----------------------------*/
let board;
let turn, numTurns;
let winner, tie;
let winningCombo;
let playerOneName, playerTwoName;
let playerOneIcon, playerTwoIcon;
let playerOneWins = 0, playerTwoWins = 0;
/*------------------------ Cached Element References ------------------------*/
const squareEls = document.querySelectorAll('.sqr');
const messageEl = document.querySelector('#message');
const boardEl = document.querySelector('.board');
const resetGameBtnEl = document.querySelector('#reset-game-button');
const resetScoreBtnEl = document.querySelector('#reset-score-button');
const saveSettingsBtnEl = document.querySelector('#save-settings-button');
const resetSettingsBtnEl = document.querySelector('#reset-settings-button');
const playerOneScoreEl = document.querySelector('#p1-score');
const playerTwoScoreEl = document.querySelector('#p2-score');
const playerOneNameEl = document.querySelector('#p1-name-input');
const playerTwoNameEl = document.querySelector('#p2-name-input');
const playerOneIconEl = document.querySelector('#p1-icon-select');
const playerTwoIconEl = document.querySelector('#p2-icon-select');
const playerOneScoreHeaderEl = document.querySelector('#p1-score-header');
const playerTwoScoreHeaderEl = document.querySelector('#p2-score-header');
/*----------------------------- Event Listeners -----------------------------*/
boardEl?.addEventListener('click', handleClick);
resetGameBtnEl?.addEventListener('click', handleGameReset);
resetScoreBtnEl?.addEventListener('click', handleScoreReset);
saveSettingsBtnEl?.addEventListener('click', handleSettingsSave);
resetSettingsBtnEl?.addEventListener('click', handleSettingsReset);
/*-------------------------------- Functions --------------------------------*/
//Event listeners
function handleClick(evt) {
    if (!evt.target)
        return;
    const clickedEl = evt.target;
    let clickedClass = clickedEl.className;
    if (clickedClass !== 'sqr')
        return;
    //Extract index and convert to integer
    let sqIdx = parseInt(clickedEl.id.replace('sq', ''));
    if (board[sqIdx] || winner)
        return;
    placePiece(sqIdx);
    checkForTie();
    checkForWinner();
    updatePlayerWins();
    switchPlayerTurn();
    render();
}
function handleGameReset() {
    init();
}
function handleScoreReset() {
    if (!playerOneScoreEl?.textContent || !playerTwoScoreEl?.textContent)
        return;
    playerTwoWins = 0;
    playerOneWins = 0;
    playerOneScoreEl.textContent = '0';
    playerTwoScoreEl.textContent = '0';
}
function handleSettingsSave() {
    changeNames();
    updateNames();
    changeIcons();
    updateBoard();
}
function handleSettingsReset() {
    if (!playerOneNameEl?.value || !playerOneIconEl?.value || !playerTwoNameEl?.value || !playerTwoIconEl?.value)
        return;
    playerOneNameEl.value = 'Player X';
    playerTwoNameEl.value = 'Player O';
    playerOneIconEl.value = 'X';
    playerTwoIconEl.value = 'O';
    changeNames();
    updateNames();
    changeIcons();
    updateBoard();
}
//Gameplay functions
function placePiece(idx) {
    board[idx] = turn;
}
function checkForTie() {
    if (!board.includes(0))
        tie = true;
}
function checkForWinner() {
    for (let combo of winningCombos) {
        let sum = 0;
        combo.forEach(sqrIdx => {
            sum += board[sqrIdx];
        });
        Math.abs(sum) === 3 ? winner = true : winner = false;
        if (winner) {
            winningCombo = combo;
            return;
        }
    }
}
function updatePlayerWins() {
    if (!playerOneScoreEl?.textContent || !playerTwoScoreEl?.textContent)
        return;
    if (winner) {
        if (turn === 1) {
            playerOneWins += 1;
            playerOneScoreEl.textContent = `${playerOneWins}`;
        }
        else {
            playerTwoWins += 1;
            playerTwoScoreEl.textContent = `${playerTwoWins}`;
        }
    }
}
function switchPlayerTurn() {
    if (winner)
        return;
    else
        turn *= -1;
}
//Update functions
function updateBoard() {
    board.forEach((square, index) => {
        let squareEl = squareEls[index];
        square ? (square > 0 ? squareEl.textContent = playerOneIcon : squareEl.textContent = playerTwoIcon) : squareEl.textContent = null;
        if (winner) {
            //Highlight the winning combination if there is a winner
            if (winningCombo.includes(index)) {
                squareEl.style.backgroundColor = 'lightgreen';
                squareEl.style.color = 'white';
            }
            else {
                squareEl.style.backgroundColor = 'white';
            }
        }
    });
}
function updateMessage() {
    if (!messageEl?.innerHTML)
        return;
    if (!winner && !tie) {
        messageEl.innerHTML = `It's ${turn > 0 ? playerOneName : playerTwoName}'s turn.`;
    }
    else if (!winner && tie) {
        messageEl.textContent = `It's a tie!`;
    }
    else {
        messageEl.innerHTML = `${turn > 0 ? playerOneName : playerTwoName} wins!`;
    }
}
function updateNames() {
    // If player saved settings with empty name, reset to default
    if (!playerOneNameEl?.value || !playerTwoNameEl?.value)
        return;
    if (!playerOneScoreHeaderEl?.textContent || !playerTwoScoreHeaderEl?.textContent)
        return;
    if (!playerOneNameEl.value)
        playerOneNameEl.value = playerOneName;
    if (!playerTwoNameEl.value)
        playerTwoNameEl.value = playerTwoName;
    playerOneScoreHeaderEl.textContent = `${playerOneName} Wins:`;
    playerTwoScoreHeaderEl.textContent = `${playerTwoName} Wins:`;
    updateMessage();
}
function changeNames() {
    if (!playerOneNameEl?.value || !playerTwoNameEl?.value)
        return;
    playerOneName = playerOneNameEl.value ? playerOneNameEl.value : 'Player X';
    playerTwoName = playerTwoNameEl.value ? playerTwoNameEl.value : 'Player O';
}
function changeIcons() {
    if (!playerOneIconEl?.value || !playerTwoIconEl?.value)
        return;
    playerOneIcon = playerOneIconEl.value;
    playerTwoIcon = playerTwoIconEl.value;
}
//Initial setup functions
function setTie() {
    tie = false;
}
function setWinner() {
    winner = false;
}
function setTurn() {
    turn = 1;
}
function setBoard() {
    winningCombo = [];
    board = [];
    numTurns = 0;
    for (let i = 0; i < 9; i++) {
        board.push(0);
    }
}
function setNames() {
    if (!playerOneNameEl?.value || !playerTwoNameEl?.value)
        return;
    playerOneName = playerOneNameEl.value;
    playerTwoName = playerTwoNameEl.value;
}
function setIcons() {
    if (!playerOneIconEl?.value || !playerTwoIconEl?.value)
        return;
    playerOneIcon = playerOneIconEl.value;
    playerTwoIcon = playerTwoIconEl.value;
}
function setBoardFormat() {
    squareEls.forEach((square) => {
        square.style.backgroundColor = 'transparent';
        square.style.color = 'black';
    });
}
function render() {
    updateBoard();
    updateMessage();
}
function init() {
    setBoard();
    setBoardFormat();
    setTurn();
    setWinner();
    setTie();
    setNames();
    setIcons();
    render();
}
init();
