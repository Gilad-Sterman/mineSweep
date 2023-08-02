'use strict'

function onEasyMode(){
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()
}

function onMediumMode(){
    gLevel.SIZE = 8
    gLevel.MINES = 14
    onInit()
}

function onHardMode(){
    gLevel.SIZE = 12
    gLevel.MINES = 32
    onInit()
}

function findNegEmptyCells(board, i, j) {
    var emptyCells = []
    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= board.length) continue
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
            if (colIdx < 0 || colIdx >= board[0].length) continue
            if (rowIdx === i && colIdx === j) continue
            if (!board[rowIdx][colIdx].isShown &&
                !board[rowIdx][colIdx].isMine &&
                !board[rowIdx][colIdx].isMarked) {
                const currCell = { i: rowIdx, j: colIdx }
                emptyCells.push(currCell)
            }
        }
    }
    return emptyCells
}

function getRandMineLocations() {
    const RandMineLocations = []
    for (var mineCount = 0; mineCount < gLevel.MINES; mineCount++) {
        const max = gLevel.SIZE - 1
        const randI = getRandomIntInclusive(0, max) 
        const randJ = getRandomIntInclusive(0, max) 
        const randMine = {i:randI,j:randJ}
        RandMineLocations.push(randMine)
    }
    return RandMineLocations
}

function getRandEmptyCell(board) {
    var emptyCells = []
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board[0].length - 1; j++) {
            if (board[i][j] === EMPTY) {
                var emptyCell = { i, j }
                emptyCells.push(emptyCell)
            }
        }
    }
    // console.log(emptyCells)
    var emptyCell = getRandCell(emptyCells)
    // console.log(emptyCell)
    return emptyCell
}

function getRandCell(emptyCells) {
    var max = emptyCells.length
    var randIdx = getRandomIntInclusive(0, max - 1)
    return emptyCells[randIdx]
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

