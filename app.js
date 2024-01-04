const board = document.getElementById("game-board");
const scoreLabel = document.getElementById("score");
const CHUNK_SIZE = 25;
const WIDTH = 25;
const HEIGHT = 25;
const SPEED = 100;
const SNAKE_LENGTH = 5;
var head = generateCoordinates(SNAKE_LENGTH, WIDTH - 1, 0, HEIGHT - 1);
var snake;
generateSnake(SNAKE_LENGTH);
var food;
spawnFood();
var score = 0;

if (head.y > 12) {
  currentDirection = "Up";
} else {
  currentDirection = "Down";
}

var previousDirection = currentDirection;

window.onload = () => {
  board.width = WIDTH * CHUNK_SIZE;
  board.height = HEIGHT * CHUNK_SIZE;
  updateBoard();
  document.addEventListener("keydown", handleDirectionInput);
  document.addEventListener("keydown", handleGameStart);
}

function updateBoard() {
  context = board.getContext("2d");
  context.fillStyle = "#464646";
  context.fillRect(0, 0, board.width, board.height);
  context.fillStyle = "#7dff63"
  context.fillRect(head.x * CHUNK_SIZE, head.y * CHUNK_SIZE, CHUNK_SIZE,
    CHUNK_SIZE);
  context.fillStyle = "#00b34a";

  for (let i = 1; i < snake.length; i++) {
    context.fillRect(snake[i].x * CHUNK_SIZE, snake[i].y * CHUNK_SIZE,
      CHUNK_SIZE, CHUNK_SIZE);
  }

  context.fillStyle = "#f24f46";
  context.fillRect(food.x * CHUNK_SIZE, food.y * CHUNK_SIZE, CHUNK_SIZE,
    CHUNK_SIZE);

  scoreLabel.innerText = `Score: ${score}`;
}

function generateCoordinates(minX, maxX, minY, maxY) {
  let x = randomNumber(minX, maxX);
  let y = randomNumber(minY, maxY);
  return { x: x, y: y }; 
}

function generateSnake(length) {
  snake = [head];

  for (let i = 1; i < length + 1; i++) {
    snake[i] = {
      x: snake[i - 1].x - 1,
      y: snake[i - 1].y
    }
  }
}

function handleGameStart(event) {
  if (event.key === "s") {
    game();
  }
}

function handleDirectionInput(event) {
  switch (event.key) {
    case "h":
      changeDirection("Left");
      break;
    case "j":
      changeDirection("Down");
      break;
    case "k":
      changeDirection("Up");
      break;
    case "l":
      changeDirection("Right");
      break;
  }
}

function changeDirection(newDirection) {
  previousDirection = currentDirection;
  currentDirection = newDirection;
}

function alignBody(grow) {
  if (grow) {
    snake.push({ x: head.x, y: head.y }); 
  }

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = { ...snake[i - 1] };
  }
}

function move() {
  alignBody(false);

  switch (currentDirection) {
    case "Left":
      head.x--;
      break;
    case "Down":
      head.y++;
      break;
    case "Up":
      head.y--;
      break;
    case "Right":
      head.x++;
      break;
  }
}

function spawnFood() {
  food = generateCoordinates(0, WIDTH - 1, 0, HEIGHT - 1);

  snake.forEach((segment) => {
    if (food.x === segment.x && food.y === segment.y) {
      food = generateCoordinates(0, WIDTH - 1, 0, HEIGHT - 1);
    }
  });
}

function eat() {
  if (head.x === food.x && head.y == food.y) {
    spawnFood();
    alignBody(true);
    score++;
  }
}

function gameOver() {
  switch (previousDirection) {
    case "Left":
      if (currentDirection === "Right") return true;
      break;
    case "Down":
      if (currentDirection === "Up") return true;
      break;
    case "Up":
      if (currentDirection === "Down") return true;
      break;
    case "Right":
      if (currentDirection === "Left") return true;
      break;
  }

  if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function game() {
  const gameInterval = setInterval(() => {
    if (!gameOver()) {
      eat();
      move();
      updateBoard();
    } else {
      let quantity;
      score === 1 ? quantity = "point" : quantity = "points";
      scoreLabel.innerText = `Game Over: You scored ${score} ${quantity}!`;
      clearInterval(gameInterval);
    }
  }, SPEED);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
