import Hero from './../models/Hero.js';
import Enemy from './../models/Enemy.js';
import { initConfiguration } from './initConfiguration.js';
import Ammo from './../models/Ammo.js';
import { distance } from './libs/distance.js'

let gameWindow = document.getElementById('gameWindow');
let pixelMap = new Map();
pixelMap.set('cover', {
  x: gameWindow.width + gameWindow.width,
  y: gameWindow.height + gameWindow.height,
  sizeFactor: 1,
});

const eusaSysiphus = {
  "E": [
    [0,1,1,1],
    [1,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [0,1,1,1], 
  ],
  "U": [
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,0],
    [0,1,1,0], 
  ],
  "S": [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,1],
    [0,0,0,1],
    [1,1,1,0], 
  ],
  "S": [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,1],
    [0,0,0,1],
    [1,1,1,0],
  ],
  "S": [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,1],
    [0,0,0,1],
    [1,1,1,0], 
  ],
  "Y": [
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,1],
    [0,0,0,1],
    [0,0,0,1], 
  ],
  "S": [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,1],
    [0,0,0,1],
    [1,1,1,0], 
  ],
  "I": [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0], 
  ],
  "P": [
    [0,1,1,1],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,0],
    [1,0,0,0], 
  ],
  "H": [
    [1,0,0,1],
    [1,0,0,1],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1], 
  ],
  "U": [
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,1],
    [0,1,1,0], 
  ],
  "S": [
    [0,1,1,1],
    [1,0,0,0],
    [0,1,1,1],
    [0,0,0,1],
    [1,1,1,0], 
  ],
  "2": [
    [1,1,1,0],
    [0,0,0,1],
    [0,1,1,0],
    [1,0,0,0],
    [0,1,1,1], 
  ],
 }

 function draw (x, y, size, arr, key, canvas, c1, c2, c3) {
	let firstX = x;
  for ( let i = 0; i <= arr[key].length-1; i+=1 ) {
    x = firstX;
    y += size;
    for ( let j = 0; j <= arr[key].length-2; j+=1 ) {
      x = x + size;
      color = '#' + Math.round(c1) + Math.round(c2) + Math.round(c3);
      if ( arr[key][i][j] === 0 ) color = '#000';
      rect(x, y, size, color, canvas);
    }	
  }
}

function rect(x, y, size, color, canvas) {
	canvas.fillStyle = color;
  canvas.fillRect(x,y,size,size);
}

let x = 25, y = 25;
let start_y = y;
let size = 5;
let color;
let dir = 1;
let c1 = 0, c2 = 1, c3 = 2;

function titleScreen() {
  let highscore = document.cookie.split(';').filter((item) => item.trim().startsWith('highscore='));
  console.log(highscore[0]);
  highscore = highscore[0] ? highscore[0].replace('highscore=', '').trim() : '0';
  let display = gameWindow.getContext('2d');
  /* let title = document.getElementById('background_music');
  title.play(); */
  display.clearRect(0, 0, gameWindow.width, gameWindow.height);
  display.drawImage(document.getElementById('bg'), 0, 0, gameWindow.width, gameWindow.height);
  let coverFigure = document.getElementById('cover');
  if ( pixelMap.get('cover').y > gameWindow.height / 3 ) {
    pixelMap.set('cover', {
      x: pixelMap.get('cover').x - 0.8,
      y: pixelMap.get('cover').y - 0.5,
      sizeFactor: pixelMap.get('cover').sizeFactor + 0.02,
    });
  }
  // console.log(pixelMap.get('cover').sizeFactor);
  display.drawImage(coverFigure, pixelMap.get('cover').x, pixelMap.get('cover').y, gameWindow.width / 20 * ( pixelMap.get('cover').sizeFactor), gameWindow.height / 20 * ( pixelMap.get('cover').sizeFactor ));
  display.fillStyle = 'white';
  display.font = '12px Consolas';
  display.fillText('Aliens are attacking earth. Don\'t let them through!', gameWindow.width * 0.05,  gameWindow.height * 0.86);
  display.font = '12px Consolas';
  display.fillText('[ENTER] START', gameWindow.width * 0.75, gameWindow.height * 0.86);
  display.fillText('[F5] Restart [F11] FULL Screen', gameWindow.width * 0.75, gameWindow.height * 0.89);
  display.fillText('Highscore: ' + highscore, gameWindow.width * 0.05, gameWindow.height * 0.89);
  c1 += 0.05;
  c2 += 0.05;
  c3 += 0.05;
  x = gameWindow.width * 0.05;
  y = gameWindow.height * 0.1;
  draw(x, y, size, eusaSysiphus, 'E', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'U', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'S', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'S', display, c1, c2, c3);
  x = x + size * 10;
  draw(x, y, size, eusaSysiphus, 'S', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'Y', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'S', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'I', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'P', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'H', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'U', display, c1, c2, c3);
  x = x + size * 5;
  draw(x, y, size, eusaSysiphus, 'S', display, c1, c2, c3);
  x = x + size * 20;
  draw(x, y, size, eusaSysiphus, '2', display, c1, c2, c3);
  if (c1 >= 9) c1 = 0;
  if (c2 >= 9) c2 = 0;
  if (c3 >= 9) c3 = 0;
  size = size + 0.005 * dir;
  if (Math.round(size) == 10) { dir = -1; } 
  if (Math.round(size, 1) == 8) { dir = 1; };
  console.log(size);
}

let activeKeys = {};
document.addEventListener("keydown", function (event) {
  // console.log(event.key);
  activeKeys[event.key] = true;
  if (event.key !== ' ') {
    activeKeys[event.key] = true;
  }
});

let start = false;
document.addEventListener("keypress", function (event) {
  if (event.key === ' ') airplane.shoot(display);
  if (event.key === 'Enter') start = true;
});

document.addEventListener("keyup", function (event) {
  delete activeKeys[event.key];
});


let objects = initConfiguration(titleScreen);
let display = objects.display;
let EnemyBuilder = objects.EnemyBuilder;
let airplane = objects.airplane;
let round = 0, last_round = 0;
let counter = 4;
let speed = 1;
function gameScreen(gameOver) {
  if ( round > last_round ) {
    speed += 0.1;
    last_round = round;
  }
  if (start) {
    if (airplane.x_pos > airplane.start_x_pos && !activeKeys['ArrowRight']) {
      airplane.break();
    }
    if (activeKeys['ArrowUp']) airplane.move(-1);
    if (activeKeys['ArrowDown']) airplane.move(1);
    if (activeKeys['ArrowRight']) airplane.accelerate();
    if (activeKeys['ArrowLeft']) airplane.break(true);
    if (activeKeys['Control']) {
      airplane.activateShield(true);
    } else {
      airplane.shield = false;
      if (airplane.accelerate === 0) airplane.symbol = document.getElementById('vehicle');
      if (airplane.shieldPower < 100) airplane.shieldPower = airplane.shieldPower + 1;
    }
    let shots = [];
    let ufos = [];
    for (let i = 0; i <= display.objectRepository.length; i += 1) {
      let object = display.objectRepository[i];
      if (object instanceof Enemy) {
        ufos.push(object);
      }
      if (object instanceof Ammo) {
        shots.push(object);
      }
    };

    if (shots.length >= 1) {
      shots.forEach((shot, i) => {
        if (shot.isAmmoOfhero) {
          shot.x_pos = shot.x_pos + airplane.width * 0.2;
        }
        if (!shot.isAmmoOfhero) {
          shot.x_pos = shot.x_pos - airplane.width * 0.1 * speed;
        }
      });
    }

    ufos.forEach((ufo) => {
      ufo.shoot(airplane, 50, display);
      ufo.move(display, speed);
      if (distance(airplane, ufo) && airplane.alive && !ufo.alive && !ufo.itemTaken) {
        const itemType = ufo.getItem();
        if (itemType === 'ammo') airplane.addAmmo(5);
        if (itemType === 'health') display.addHealthToHealthBar(5);
        display.addNumberToScore(5);
      }

      if (distance(airplane, ufo) && airplane.alive && ufo.alive) {
        // display.addNumberToScore(-10);
        display.health = display.health - 1;
      }

      shots.forEach((shot, i) => {
        // only shots should hit that haven't actually hit
        // inactive shots do not have a symbol
        if (distance(shot, ufo) && shot.alive && shot.isAmmoOfhero && ufo.alive) {
          shot.alive = false;
          ufo.dropItem(display);
          display.addNumberToScore(10);
        }
        if (distance(shot, airplane) && shot.alive && !shot.isAmmoOfhero && !airplane.shield) {
          shot.set('symbol', document.getElementById('white'));
          shot.alive = false;
          // display.addNumberToScore(-5);
          display.health = display.health - 20;
        }
      });
    });

    // CleanUp 
    display.objectRepository = display.objectRepository.filter((object) => {
      // Enemy Cleanup 
      // Take only enemies that are visible
      if (object instanceof Enemy && object.x_pos > 0) {
        // Take only enemy items (items dropped by enemies)
        if (!object.alive && !object.itemTaken) {
          return object;
          // Or take aliens that are still alive 
        } else if (object.alive && !object.itemTaken) {
          return object;
        }
      }
      if (object.alive && !object.itemTaken && object instanceof Enemy && object.x_pos > (-1 * (object.width * 5))) {
        return object;
      }
      if (object instanceof Enemy && !object.alive && !object.itemTaken) {
        return object;
      }
      if (object.alive === true && (object.x_pos <= display.gameWindow.width && !object instanceof Ammo)) {
        return object;
      }
      if (object instanceof Ammo && (object.x_pos > 0 && object.x_pos < display.gameWindow.width)) {
        return object;
      }
      if (object instanceof Hero) {
        return object;
      }
    });
    const ufoCounter = display.objectRepository.filter((object) => {
      if (object instanceof Enemy && object.x_pos > 0) {
        return object;
      }
    }).length;
    
    if (ufoCounter === 0) {
      if ( round % 2 === 0 ) {
        EnemyBuilder(counter, 100, 0);
      } else {
        EnemyBuilder(counter, 50, 1);
      }
      // EnemyBuilder(counter, 50);
      counter = Math.round(counter * 1.2);
      round += 1;
    }

    if (display.health <= 0) {
      display.gameOver();
      round = 0;
      counter = 2;
      //  start = false;
      display.health = 100;
      return true;
    }

    if (ufoCounter > 0) {
      ufos.forEach((ufo) => {
        if (ufo.x_pos < 0 - ufo.width && ufo.alive) {
          display.gameOver();
          ufos = [];
          round = 0;
          counter = 2;
          // start = false; 
          display.health = 100;
          return true;
        }
      });
    }
    display.refresh();
    // console.log(display.objectRepository.length);
  }
}
let end = false;
document.getElementById('background_music').play();
window.onload = function () {
  function animate() {
    if (end) {
      cancelAnimationFrame(animate);
    } else {
      requestAnimationFrame(animate);
      if ( !start ) titleScreen();
      gameScreen(false);
    }
  };
  animate();
}



