const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const COLOR = {
  paddle: "black",
  brick: "red",
  stroke: "black",
  ball: "green",
};

const cols = 10;
const rows = 5;
const gap = 1;
const radius = 5;
let gameStart = false;
const SIZE = {
  paddle: {
    width: 75,
    height: 5,
  },
  brick: {
    width: (canvas.width - (cols - 1 * gap)) / cols,
    height: 10,
  },
};

// const SCREEN_POSITION = {
//   centerLine: canvas.width / 2,
//   top:0,
//   right:canvas.width,
//   bottom:canvas.height,
//   left:0,
// };

class Paddle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = COLOR.paddle;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.closePath();
  }
}

const paddle = new Paddle(
  canvas.width / 2 - SIZE.paddle.width / 2,
  canvas.height - (5 + SIZE.paddle.height),
  SIZE.paddle.width,
  SIZE.paddle.height
);

class Brick {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = COLOR.brick;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    // ctx.strokeStyle = COLOR.stroke;
    // ctx.lineWidth = 1;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let x = 0 + j * (gap + this.width);
        let y = 0 + i * (gap + this.height);
        ctx.fillRect(x, y, this.width, this.height);
        // 繪製邊框
        // ctx.strokeRect(x + 0.5, y + 0.5, this.width - 1, this.height - 1);
      }
    }
    ctx.closePath();
  }
}
const brick = new Brick(0, 0, SIZE.brick.width, SIZE.brick.height);

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.r = radius;
    this.color = COLOR.ball;
    this.speed = 3;
    this.dirX = Math.round(Math.random()) === 1 ? 1 : -1;
    this.dirY = -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move() {
    this.x += this.speed * this.dirX;
    this.y += this.speed * this.dirY;
  }
}

const ball = new Ball(paddle.x + paddle.w / 2, paddle.y - radius, radius);

window.addEventListener("keydown", function (e) {
  let keyDown = e.keyCode;
  if (keyDown === 37 || keyDown === 39) {
    gameStart = true;
    switch (keyDown) {
      case 37: {
        paddle.x -= 10;
        break;
      }
      case 39: {
        paddle.x += 10;
        break;
      }
    }
  }
});

function checkCollision() {
  // paddle 與 邊界的碰撞偵測
  if (paddle.x + paddle.w >= canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x <= 0) {
    paddle.x = 0;
  }
  // paddle 與 球的碰撞偵測
  if (ball.y + ball.r >= paddle.y) {
    if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) {
      ball.dirY *= -1;
    }
  }
  // ball 與 邊界碰撞偵測
  if (ball.x - ball.r <= 0) {
    ball.x = ball.r;
    ball.dirX *= -1;
  }
  // ball 與 邊界碰撞偵測
  if (ball.x + ball.r >= canvas.width) {
    ball.x = canvas.width - ball.r;
    ball.dirX *= -1;
  }
  // ball 與 邊界碰撞偵測
  if (ball.y >= canvas.height + 2 * ball.r) {
    gameStart = false;
    alert("結束遊戲");
    window.location.reload();
  }
  // ball 與 邊界碰撞偵測
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.dirY *= -1;
  }
}

function init() {
  paddle.draw();
  brick.draw();
  ball.draw();
}

(function () {
  init();
})();

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameStart) {
    ball.move();
    checkCollision();
  }
  paddle.draw();
  brick.draw();
  ball.draw();
  const id = setTimeout(render, 30);
}
render();
