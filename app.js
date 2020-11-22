document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let score = 0;
  let startingPoint = 150;
  let doodlerLeftSpace = 50;
  let doodlerBottomSpace = startingPoint;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let isJumping = false;
  let isGoingLeft = false;
  let isGoingRight = false;
  let upTimerId;
  let downTimerId;
  let leftTimerId;
  let rightTimerId;

  function createDoodler() {
    grid.appendChild(doodler)
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
  }

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const visual = this.visual;
      visual.classList.add('platform');
      visual.style.left = this.left + 'px';
      visual.style.bottom = this.bottom + 'px';
      grid.appendChild(visual);

    }
  }

  function createPlatfroms() {
    for (let i = 0; i < 5; i++) {
      let platformGap = 600 /platformCount;
      let newPlatformBottom = 100 + i * platformGap;
      let newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform)
    }
  }

  function movePlatfroms() {
    if(doodlerBottomSpace > 200) {
      platforms.forEach(platform => {
        platform.bottom -= 4;
        let visual = platform.visual;
        visual.style.bottom = platform.bottom + 'px';

        if(platform.bottom < 10) {
          let firstPlatfrom = platforms[0].visual;
          firstPlatfrom.classList.remove('platform');
          platforms.shift();
          let newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function moveLeft() {
    isGoingLeft = true;
    clearInterval(rightTimerId);
    leftTimerId = setInterval(function() {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace;
      if(doodlerLeftSpace - 4 <= 0 ) {
        clearInterval(leftTimerId);
      }
    }, 30);
  }

  function moveRight() {
    isGoingRight = true;
    clearInterval(leftTimerId);
    rightTimerId = setInterval(function() {
      doodlerLeftSpace += 4;
      doodler.style.left = doodlerLeftSpace;
      if(doodlerLeftSpace + 60 >= 400) {
        clearInterval(rightTimerId);
      }
    }, 30);
  }

  function jump() {
    if(!isJumping) {
      isJumping = true;
      clearInterval(downTimerId)
      upTimerId = setInterval(function () {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if(doodlerBottomSpace > startingPoint + 200) {
          fall();
        }
      }, 100);
    }
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerId);
    downTimerId = setInterval(function() {
      doodlerBottomSpace -= 20;
      doodler.style.bottom = doodlerBottomSpace + 'px';
      console.log(doodlerBottomSpace)
      if(doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach(platform => {
        if(
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85
        ) {
          startingPoint = doodlerBottomSpace;
          score++;
          jump();
        }
      });
    }, 100);
  }

  function gameOver() {
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    while(grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    isGameOver = true;
  }

  function control(e) {
    const { key } = e;

    switch(key) {
      case "ArrowLeft": 
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        jump();
      default:
        break;
    }
  }

  function start() {
    if(!isGameOver) {
      createPlatfroms();
      createDoodler();
      setInterval(movePlatfroms, 30);
      document.addEventListener('keydown', control);
    }
  }

  // TODO: Add a button to start
  start()
  
});