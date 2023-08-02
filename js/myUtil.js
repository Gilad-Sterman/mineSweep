'use strict'

function onEasyMode() {
    gLevel.SIZE = 4
    gLevel.MINES = 2
    onInit()
}

function onMediumMode() {
    gLevel.SIZE = 8
    gLevel.MINES = 14
    onInit()
}

function onHardMode() {
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
        const randMine = getRandCell()
        RandMineLocations.push(randMine)
    }
    return RandMineLocations
}


function getRandCell() {
    const max = gEmtyCells.length - 1
    const randCellIdx = getRandomIntInclusive(0, max)
    const randCell = gEmtyCells[randCellIdx]
    gEmtyCells.splice(randCellIdx, 1)
    return randCell
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildMat() {
    const idxArray = []
    const mat = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        mat[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            mat[i][j] = { i, j }
            idxArray.push(mat[i][j])
        }
    }
    return idxArray
}


function getRandEmptyCell(board) {
    var allCells = []
    for (var i = 0; i < board.length - 1; i++) {
        for (var j = 0; j < board[0].length - 1; j++) {
            var currCell = { i, j }
            allCells.push(currCell)
        }
    }
    // console.log(emptyCells)
    var randCell = getRandCell(allCells)
    // console.log(emptyCell)
    return randCell
}
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}