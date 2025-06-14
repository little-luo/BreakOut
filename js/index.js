const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const COLOR = {
  paddle: "black",
  brick: "red",
  stroke: "black",
  ball: "green",
};

const cols = 10;
const rows = 3;
const gap = 1;
const radius = 5;
let score = 0;
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
    // for (let i = 0; i < rows; i++) {
    //   for (let j = 0; j < cols; j++) {
    //     let x = 0 + j * (gap + this.width);
    //     let y = 0 + i * (gap + this.height);
    //     ctx.fillRect(x, y, this.width, this.height);
    //     // 繪製邊框
    //     // ctx.strokeRect(x + 0.5, y + 0.5, this.width - 1, this.height - 1);
    //   }
    // }
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.closePath();
  }
}
let allBricks = [];
// 建立所有的磚塊物件
function createAllBricks() {
  for (let i = 0; i < rows; i++) {
    let temp = [];
    for (let j = 0; j < cols; j++) {
      let x = 0 + j * (gap + SIZE.brick.width);
      let y = 0 + i * (gap + SIZE.brick.height);
      const brick = new Brick(x, y, SIZE.brick.width, SIZE.brick.height);
      temp.push(brick);
    }
    allBricks.push(temp);
    allBricks = allBricks.flat();
  }
}

// 顯示所有的磚塊物件
function displayAllBricks() {
  for (let i = 0; i < allBricks.length; i++) {
    allBricks[i].draw();
  }
}

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

// keydawn 事件監聽
window.addEventListener("keydown", handleKeyDown);
function handleKeyDown(e) {
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
}

// 音效
const sound = {
  playBrick() {
    const brickSound = new Audio("./audio/brick.m4a");
    brickSound.play();
  },
  playPaddle() {
    const paddleSound = new Audio("./audio/paddle.m4a");
    paddleSound.play();
  },
  playWall() {
    const wallSound = new Audio("./audio/wall.m4a");
    wallSound.play();
  },
  playGameOver() {
    const gameOverSound = new Audio("./audio/game_over.mp3");
    gameOverSound.play();
  },
  playWinning() {
    const winSound = new Audio("./audio/winning.mp3");
    winSound.play();
  },
};

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
    if (ball.x >= paddle.x && ball.x <= paddle.x + paddle.w && ball.dirY > 0) {
      ball.dirY *= -1;
      sound.playPaddle();
    }
  }
  // ball 與 邊界碰撞偵測
  if (ball.x - ball.r <= 0) {
    ball.x = ball.r;
    ball.dirX *= -1;
    sound.playWall();
  }
  // ball 與 邊界碰撞偵測
  if (ball.x + ball.r >= canvas.width) {
    ball.x = canvas.width - ball.r;
    ball.dirX *= -1;
    sound.playWall();
  }
  // ball 與 邊界碰撞偵測
  if (ball.y >= canvas.height + 2 * ball.r) {
    // gameStart的值 為 true，迴圈第一次執行，呼叫 stopGame() 改變 gameStart的值 為 false。
    // 接著由於gameStart的值 為 false，所以會結束 while 迴圈 ， 再次呼叫 stopGame() 結束遊戲
    while (gameStart === true) {
      stopGame();
    }
    stopGame();
  }
  // ball 與 邊界碰撞偵測
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.dirY *= -1;
    sound.playWall();
  }
  // ball 與 所有磚塊碰撞偵測
  for (let i = 0; i < allBricks.length; i++) {
    if (ball.y <= allBricks[i].y + allBricks[i].height) {
      if (
        ball.x >= allBricks[i].x &&
        ball.x <= allBricks[i].x + allBricks[i].width
      ) {
        allBricks.splice(i, 1);
        // 印出磚塊的數量
        // console.log(allBricks.length);
        ball.dirY *= -1;
        displayScore((score += 10));
        sound.playBrick();
      }
    }
  }
}

function stopGame() {
  window.removeEventListener("keydown", handleKeyDown);
  // 第一次呼叫 stopGame() 的時候 gameStart 為 true，所以不會跳出結束遊戲彈窗，刷新頁面
  // 而是僅改變 gameStart 的值 為 false。
  // 第二次呼叫 stopGame() 的時候 gameStart 為 false，所以會播放音效跳出結束遊戲彈窗，刷新頁面
  if (gameStart === false) {
    let time = undefined;
    if (allBricks.length === 0) {
      time = 2000;
      sound.playWinning();
    } else {
      time = 800;
      sound.playGameOver();
    }
    // 撥放完音效，跳出結束遊戲彈窗，刷新頁面
    setTimeout(function () {
      alert("結束遊戲");
      window.location.reload();
    }, time);
  }
  gameStart = false;
}

// 顯示分數
function displayScore(score) {
  // 移除舊的 span_el
  let span_el = document.getElementsByTagName("span")[0];
  if (span_el) {
    span_el.remove();
  }
  // 新增新的 span_el
  span_el = document.createElement("span");
  span_el.style.position = "absolute";
  span_el.style.right = "0.5em";
  span_el.style.top = "0.5em";
  span_el.style.fontSize = "1.5em";
  span_el.textContent = `Score:${score}`;
  document
    .getElementsByTagName("body")[0]
    .insertAdjacentHTML("afterbegin", span_el.outerHTML);
}

// 第一次執行初始化
function init() {
  paddle.draw();
  createAllBricks();
  ball.draw();
  displayScore(0);
}

// IIFE立即呼叫函式
(function () {
  init();
})();

// 渲染畫面
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameStart) {
    ball.move();
    checkCollision();
  }
  paddle.draw();
  displayAllBricks();
  ball.draw();
  // 當 allBricks的長度為 0 時，表示沒有任何磚塊物件，第一次執行while迴圈，呼叫 stopGame()， 將 gameStart 的值 改為 false
  // 第二次執行while迴圈，由於gameStart 的值 已經改為 false，所以會結束while迴圈，再次呼叫stopGame()，結束遊戲
  if (allBricks.length === 0) {
    while (gameStart === true) {
      stopGame();
    }
    stopGame();
    return;
  }
  const id = setTimeout(render, 30);
}
render();
