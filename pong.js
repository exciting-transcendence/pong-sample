const url = `http://localhost:3000/api/auth/create?username=A${Math.floor(Math.random() * 10000 )}`


fetch (url, {
  mode: 'cors'
})
.then((res) => res.json())
.then(data => joinGame(data.access_token))

function joinGame(jwt) {

  const socketOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${jwt}`
        }
      }
    }
 };
  const socket = io('http://localhost:3000/api/pong/match', socketOptions)

// private ball: Ball;
// private leftPaddle: Paddle;
// private rightPaddle: Paddle;
// private leftScore: number = 0
// private rightScore: number = 0
// private lastUpdate: number = 0
// private difficulty: CONSTANTS.PongMode
// private winner: 'left' | 'right' | null = null

socket.emit('match', {
  uid: Math.floor(Math.random() * 10000),
  mode: 'easy',
  matchType: 'quick'
})

const ctx = document.getElementById('main').getContext('2d')

socket.on('render', (data) => {
  ctx.clearRect(0, 0, 600, 600)
  ctx.fillRect(data.ball.x, data.ball.y, data.ball.width, data.ball.height)
  ctx.fillRect(data.leftPaddle.x, data.leftPaddle.y, data.leftPaddle.width, data.leftPaddle.height)
  ctx.fillRect(data.rightPaddle.x, data.rightPaddle.y, data.rightPaddle.width, data.rightPaddle.height)
  document.getElementById('score').children[0].innerHTML = data.leftScore
  document.getElementById('score').children[1].innerHTML = data.rightScore
})

socket.on('gameEnd', (data) => {
  document.getElementById('winner').innerHTML = `Winner is: ${data.winner}`
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    socket.emit('movePaddle', {
      key: 'up',
      isDown: true
    })
  }

  if (e.key === 'ArrowDown') {
    socket.emit('movePaddle', {
      key: 'down',
      isDown: true
    })
  }
})

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') {
    socket.emit('movePaddle', {
      key: 'up',
      isDown: false
    })
  }

  if (e.key === 'ArrowDown') {
    socket.emit('movePaddle', {
      key: 'down',
      isDown: false
    })
  }
})
}