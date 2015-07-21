var canvas,
    context,
    workspace,
    title,
    score,
    startButton,
    pauseButton,
    resetButton;

var i,
    snakeLength,
    up,
    down,
    left,
    right,
    keyPressed,
    keyUp,
    keyDown,
    keyLeft,
    keyRight,
    x,
    y,
    head,
    tail,
    snakeHead,
    snakeHeadCenterX,
    snakeHeadCenterY,
    snakeWidth,
    snakeHeight,
    snake,
    snakePart,
    distanceBetweenObjects,
    apple,
    appleCenterX,
    appleCenterY,
    appleWidth,
    appleHeight,
    appleCoordinateX,
    appleCoordinateY,
    hasApple,
    speed,
    directions,
    currentDirection,
    previousDirection,
    finalScore,
    gameIsRunning,
    gameIsPaused;

function initializeDefaultParameters() {
    up = 0;
    down = 1;
    left = 2;
    right = 3;

    keyLeft = 37;
    keyUp = 38;
    keyRight = 39;
    keyDown = 40;

    x = 50;
    y = 150;

    createSnake();

    apple = new Image();
    apple.src = './sources/apple-scaled.png';

    appleWidth = 18;
    appleHeight = 20;
    hasApple = false;

    directions = ['up', 'down', 'left', 'right'];
    previousDirection = directions[right];
    currentDirection = directions[right];

    finalScore = 0;
}

// Setup UI
window.onload = function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    workspace = document.getElementById('workspace');
    title = document.getElementById('title');
    score = document.getElementById('score');
    startButton = document.getElementById('start-button');
    pauseButton = document.getElementById('pause-button');
    resetButton = document.getElementById('reset-button');

    workspace.style.position = 'absolute';
    workspace.style.top = (screen.height / 2 - (2 / 3) * canvas.height + 50) + 'px';
    workspace.style.left = (screen.width / 2 - canvas.width / 2) + 'px';

    title.style.position = 'absolute';
    title.style.top = (screen.height / 2 - (2 / 3) * canvas.height - 130) + 'px';
    title.style.left = (screen.width / 2 - canvas.width / 2) + 'px';

    score.style.position = 'absolute';
    score.style.top = (screen.height / 2 - (2 / 3) * canvas.height + 60 + canvas.height) + 'px';
    score.style.left = (screen.width / 2 + 60) +  'px';

    startButton.style.position = 'absolute';
    startButton.style.top = (screen.height / 2 - canvas.clientHeight / 2) + 'px';
    startButton.style.left = (screen.width / 2 - canvas.width / 2 - startButton.clientWidth - 30) + 'px';

    pauseButton.style.position = 'absolute';
    pauseButton.style.top = (screen.height / 2 - canvas.clientHeight / 2 + startButton.clientHeight + 10 ) + 'px';
    pauseButton.style.left = (screen.width / 2 - canvas.width / 2 - pauseButton.clientWidth - 30) + 'px';

    resetButton.style.position = 'absolute';
    resetButton.style.top = (screen.height / 2 - canvas.clientHeight / 2 + pauseButton.clientHeight + startButton.clientHeight + 20 ) + 'px';
    resetButton.style.left = (screen.width / 2 - canvas.width / 2 - resetButton.clientWidth - 30) + 'px';
};

window.onkeyup = function(e) {
    keyPressed = e.keyCode ? e.keyCode : e.which;

    previousDirection = currentDirection;

    switch(keyPressed) {
        case keyUp: {
            if(previousDirection !== directions[down]) {
                currentDirection = directions[up];
            }
            break;
        }
        case keyDown: {
            if(previousDirection !== directions[up]) {
                currentDirection = directions[down];
            }
            break;
        }
        case keyLeft: {
            if(previousDirection !== directions[right]) {
                currentDirection = directions[left];
            }
            break;
        }
        case keyRight: {
            if(previousDirection !== directions[left]) {
                currentDirection = directions[right];
            }
            break;
        }
    }
};

function runSnake() {

    spawnApple();

    checkCurrentDirection();

    moveSnake();

    checkForAllCollisions();

    if(gameIsRunning) {
        requestAnimationFrame(runSnake);
    }
    else if(gameIsPaused) {
        setPauseScreen();
    }
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCurrentDirection() {
    switch(currentDirection) {
        case directions[up]:
        {
            snakeHead = {
                x: snake[head].x,
                y: snake[head].y - speed
            };
            snake.unshift(snakeHead);
            snake.pop(tail);
            break;
        }
        case directions[down]:
        {
            snakeHead = {
                x: snake[head].x,
                y: snake[head].y + speed
            };
            snake.unshift(snakeHead);
            snake.pop(tail);
            break;
        }
        case directions[left]:
        {
            snakeHead = {
                x: snake[head].x - speed,
                y: snake[head].y
            };
            snake.unshift(snakeHead);
            snake.pop(tail);
            break;
        }
        case directions[right]:
        {
            snakeHead = {
                x: snake[head].x + speed,
                y: snake[head].y
            };
            snake.unshift(snakeHead);
            snake.pop(tail);
            break;
        }
    }
}

function checkForAllCollisions() {
    if(appleCollisionDetected()) {
        hasApple = false;
        finalScore += 20;

        increaseSnakeLength();
        updateScore();
    }
    else if (boundariesCollisionDetected()) {
        setGameOverScreen();
    }
    else if(selfCollisionDetected()) {
        setGameOverScreen();
    }
}

function spawnApple() {
    if(!hasApple) {
        hasApple = true;
        appleCoordinateX = getRandomInteger(0, canvas.width-10);
        appleCoordinateY = getRandomInteger(0, canvas.height-10);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    if(hasApple) {
        context.drawImage(apple, appleCoordinateX,appleCoordinateY);
    }
}

function moveSnake() {
    for(snakePart = 0; snakePart < snakeLength - 1; snakePart +=1 ) {
        context.fillRect(snake[snakePart].x, snake[snakePart].y, snakeWidth, snakeHeight);

        if(snakePart === head) {
            context.strokeStyle = '#a4f95e';
            context.lineWidth = 2;
            context.strokeRect(snake[snakePart].x, snake[snakePart].y, snakeWidth, snakeHeight);
        }
    }
}

function increaseSnakeLength() {
    snakeLength += 1;
    speed += Math.floor(finalScore/100);

    snake.push({
        x: snake[tail].x,
        y: snake[tail].y
    });
}

function createSnake() {
    snakeWidth = 10;
    snakeHeight = 10;
    snakeLength = 15;

    head = 0;
    tail = 2;

    speed = 3;
    snake = [];

    for(i = snakeLength - 1; i > 0; i-=1) {
        snake.push({x: i, y: 100});
    }
}

function boundariesCollisionDetected() {
    if (snake[head].x < 0 || snake[head].x > canvas.width ||
        snake[head].y < 0 || snake[head].y > canvas.height) {
        return true;
    }
    return false;
}

function setGameOverScreen() {
    gameIsRunning = false;
    context.save();
    context.clearRect(0,0,canvas.width, canvas.height);
    context.fillStyle = "#ff4800";
    context.font = '80px Papyrus';
    context.fillText('Game Over', canvas.width / 5, canvas.height / 2);
    context.restore();
}

function setPauseScreen() {
    context.save();
    context.clearRect(0,0,canvas.width, canvas.height);
    context.fillStyle = "#ff4800";
    context.font = '80px Papyrus';
    context.fillText('Game Paused', canvas.width / 6, canvas.height / 2);
    context.restore();
}

function selfCollisionDetected() {
    // Check if head piece collides with every other piece
    for(i = 1; i < snakeLength - 1; i+=1) {
        if (snake[head].x === snake[i].x &&
            snake[head].y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function appleCollisionDetected() {
    snakeHeadCenterX = snake[head].x + snakeWidth/2;
    snakeHeadCenterY = snake[head].y + snakeHeight/2;

    appleCenterX = appleCoordinateX + appleWidth/2;
    appleCenterY = appleCoordinateY + appleHeight/2;

    distanceBetweenObjects = (Math.sqrt(Math.pow((snakeHeadCenterX - appleCenterX), 2) + Math.pow((snakeHeadCenterY - appleCenterY), 2)));

    if (distanceBetweenObjects < Math.sqrt(2)*(snakeWidth/2 + snakeHeight/2)) {
        return true;
    }
    return false;
}

function startNewGame() {
    if(!gameIsRunning) {
        gameIsRunning = true;
        gameIsPaused = false;
        initializeDefaultParameters();
        updateScore();
        runSnake();
    }
}

function pauseGame() {
    if(gameIsRunning) {
        gameIsRunning = false;
        gameIsPaused = true;
    }
}

function resetGame() {
    if(!gameIsRunning) {
        gameIsRunning = true;
        gameIsPaused = false;
        runSnake();
    }
}

function updateScore() {
    var scoreElement = document.getElementById('score');
    scoreElement.innerHTML = "Score: " + finalScore;
}



