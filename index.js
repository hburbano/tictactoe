const readline = require('readline')

// Function that returns an empty board
const initialBoard = () => [
  ['_', '_', '_'],
  ['_', '_', '_'],
  ['_', '_', '_'],
]

const printBoard = () => {
  console.clear()
  console.log('  0 1 2')
  board.map((line, index) => console.log(`${index} ${line}`))
}

// Check if a move is valid
const isValid = (move) => {
  const [x, y] = move.split(',')
  if (x >= 0 && y >= 0 && x <= 2 && y <= 2 && board[+x][+y] === '_') return true
  return false
}

/**
 * Returns a board state:
 * returns: 'CPU_WINS' or 'PLAYER_WINS' if theres a board winner
 *          'CONTINUE' if the board has empty spaces to still play
 *          'TIE' if the board does not have empty spaces
 */
const checkBoardStatus = () => {
  const flatBoard = board.join('-').replace(/,/g, '')
  // Crafty regex, to check possible 16 possible win situations:
  // https://www.codewars.com/kata/525caa5c1bf619d28c000335/solutions/javascript
  if (/XXX|X...X...X|X....X....X|X..X..X/.test(flatBoard)) return 'PLAYER_WINS'
  if (/OOO|O...O...O|O....O....O|O..O..O/.test(flatBoard)) return 'CPU_WINS'
  if (/_/.test(flatBoard)) return 'CONTINUE'
  return 'TIE'
}

const CPUTurn = (remainingMoves) => {
  const move = Math.floor(Math.random() * remainingMoves.length)
  const [x, y] = remainingMoves[move].split(',')
  board[x][y] = 'O'
}

// Get an array of possible moves as ["0,1", "0,2"...]
const getRemainingMoves = () => {
  const moves = board
    .map((line, x) =>
      line.map((row, y) => (board[x][y] === '_' ? `${x},${y}` : undefined))
    )
    .flat()
    .filter((x) => x != undefined)
  return moves
}

const mainLoop = (move) => {
  const [x, y] = move.split(',')
  board[+x][+y] = 'X'
  printBoard()
  let boardStatus = checkBoardStatus()
  if (boardStatus !== 'CONTINUE') {
    endGame(boardStatus)
  } else {
    CPUTurn(getRemainingMoves())
    boardStatus = checkBoardStatus()
    console.log('CPU is Moving')
    setTimeout(() => {
      printBoard()
      if (boardStatus === 'CPU_WINS') {
        endGame(boardStatus)
      } else {
        asyncGameLoop()
      }
    }, 750)
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const endGame = (boardStatus) => {
  switch (boardStatus) {
    case 'CPU_WINS':
      console.log('The CPU has won')
      break
    case 'PLAYER_WINS':
      console.log('You have won')
      break
    case 'TIE':
      console.log('Its a tie')
    default:
      break
  }
  rl.question(
    'What do you want to do? type "terminate" or "restart" the game?\n',
    (action) => {
      switch (action) {
        case 'terminate':
          console.log('Bye')
          rl.close()
          break
        case 'restart':
          board = initialBoard()
          printBoard()
          asyncGameLoop()
        default:
          break
      }
    }
  )
}

const asyncGameLoop = () => {
  rl.question(
    'Chose your move? type "x,y" position or "terminate"\n',
    (move) => {
      const remainingMoves = getRemainingMoves()
      if (move === 'terminate') {
        rl.close()
        return null
      } else if (isValid(move) && remainingMoves.length > 0) {
        mainLoop(move)
      } else {
        console.log('Invalid move or command')
        asyncGameLoop()
      }
    }
  )
}

// Initialize and start game board
let board = initialBoard()
printBoard()
asyncGameLoop()
