'use strict'

const MINE = '💣'
const MARK = '🚩'
const EMPTY = ''
var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gFirstClicked = 0
var gEmtyCells
var gRandMineLocations

function onInit() {
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gFirstClicked = 0
    gEmtyCells = buildMat()
    gRandMineLocations = getRandMineLocations()
    gBoard = buildBoard()
    // console.table(gBoard)
    renderBoard(gBoard)
    document.addEventListener('contextmenu', event => event.preventDefault());
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAround: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    placeMines(gRandMineLocations,board)
    // board[1][1].isMine = true
    // board[2][3].isMine = true
    // board[0][0].isShown = true
    setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            var cellContent = EMPTY
            var className = `cell cell-${i}-${j}`
            if (cell.isMarked) cellContent = MARK
            if (cell.isShown) {
                if (cell.isMine) cellContent = MINE
                else cellContent = (cell.minesAround !== 0) ? cell.minesAround : EMPTY
                className += ' shown'
                strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})">${cellContent}</td>`
            } else strHTML += `<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// function renderCinema() {
//     var strHTML = ''
//     for (var i = 0; i < gCinema.length; i++) {
//         strHTML += `<tr class="cinema-row" >\n`
//         for (var j = 0; j < gCinema[0].length; j++) {
//             const cell = gCinema[i][j]
//             // For cell of type SEAT add seat class:
//             var className = (cell.isSeat) ? 'seat' : ''
//             if (cell.isBooked) {
//                 className += ' booked'
//             }
//             // Add a seat title:
//             const title = `Seat: ${i + 1}, ${j + 1}`

//             // TODO: for cell that is booked add booked class

//             strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="cell ${className}"
//                             onclick="onCellClicked(this, ${i}, ${j})" >
//                          </td>\n`
//         }
//         strHTML += `</tr>\n`
//     }
//     // console.log(strHTML)

//     const elSeats = document.querySelector('.cinema-seats')
//     elSeats.innerHTML = strHTML
// }

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gFirstClicked === 0) gFirstClicked = { i, j }
    if (gBoard[i][j].isMarked) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMine) {
        console.log('GAME OVER')
        showAllCells()
        return
    }
    elCell.classList.add('shown')
    gBoard[i][j].isShown = true
    gGame.shownCount++
    expandShown(gBoard, i, j)
    // const clickedCell = document.querySelector(`.cell cell-${i}-${j}`)
    // clickedCell.classList
    // console.log('elCell:', elCell)
    // console.log('i:', i, 'j:', j)
    renderBoard(gBoard)
    checkVictory()
}

function onCellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        elCell.innerText = EMPTY
        // console.log('unmark')
        gGame.markedCount--
        // checkVictory()
    } else {
        gBoard[i][j].isMarked = true
        elCell.innerText = MARK
        // console.log('mark')
        gGame.markedCount++
        checkVictory()
    }
}

function showAllCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].isShown = true
        }
    }
    renderBoard(gBoard)
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAround = getCellMinesNegsCount(i, j, board)
        }
    }
}

function getCellMinesNegsCount(i, j, board) {
    var minesCount = 0
    for (var rowIdx = i - 1; rowIdx <= i + 1; rowIdx++) {
        if (rowIdx < 0 || rowIdx >= board.length) continue
        for (var colIdx = j - 1; colIdx <= j + 1; colIdx++) {
            // console.log([rowIdx], [colIdx])
            // console.log(gBoard[rowIdx][colIdx])
            if (colIdx < 0 || colIdx >= board[0].length) continue
            if (rowIdx === i && colIdx === j) continue
            if (board[rowIdx][colIdx].isMine) minesCount++
            // console.log(gBoard[rowIdx][colIdx])
        }
    }
    return minesCount
}

function expandShown(board, i, j) {
    const emptyCells = findNegEmptyCells(board, i, j)
    const extraShownCount = emptyCells.length
    gGame.shownCount += extraShownCount
    for (var idx = 0; idx < emptyCells.length; idx++) {
        const emptyCell = emptyCells[idx]
        board[emptyCell.i][emptyCell.j].isShown = true
    }
    // renderBoard(board)
}

function placeMines(RandMineLocations,board) {
    for (var idx = 0; idx < RandMineLocations.length; idx++) {
        const currMineLocation = RandMineLocations[idx]
        const currMine = board[currMineLocation.i][currMineLocation.j]
        currMine.isMine = true
    }
}


function checkVictory() {
    const vMarkedCount = gLevel.MINES
    const vShownCount = gLevel.SIZE ** 2 - gLevel.MINES
    // console.log('vShownCount:',vShownCount)
    if (gGame.markedCount === vMarkedCount && gGame.shownCount === vShownCount) {
        alert('YOU WIN!')
        gGame.isOn = false
    }
}
