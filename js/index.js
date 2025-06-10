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
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
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
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const ball = new Ball(paddle.x + paddle.w / 2, paddle.y - radius, radius);

function init() {
  paddle.draw();
  brick.draw();
  ball.draw();
}

(function () {
  init();
})();
