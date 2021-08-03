import Hero from './../models/Hero.js';
import Enemy from './../models/Enemy.js';
import Display from './../models/Display.js';
import Ammo from './../models/Ammo.js';

const distance = (o1, o2) => {
  /* const x_square = Math.pow( o2.get('x_pos') - o1.get('x_pos'), 2 );
  const y_square = Math.pow( o2.get('y_pos') - o1.get('y_pos'), 2 );
  return Math.sqrt( x_square + y_square );*/
  if (o1.x_pos < o2.x_pos + o2.width &&
    o1.x_pos + o1.width > o2.x_pos &&
    o1.y_pos  < o2.y_pos  + o2.height &&
    o1.y_pos  + o1.height > o2.y_pos ) {
      return true;
  }
  return false;
}
function titleScreen() {
    /* let title = document.getElementById('background_music');
    title.play(); */
    let gameWindow = document.getElementById('gameWindow');
    let display = gameWindow.getContext('2d');
    display.clearRect(0, 0, gameWindow.width, gameWindow.height);
    display.drawImage(document.getElementById('hello'), 0, 0, gameWindow.width, gameWindow.height);
    display.drawImage(document.getElementById('cover'), gameWindow.width * 0.5 , gameWindow.height * 0.2, gameWindow.width * 0.4, gameWindow.height * 0.5);
    display.fillStyle = 'black';
    display.font = '14px Consolas';
    display.fillText('Aliens are attacking earth. Don\'t let them through!', gameWindow.width * 0.05, gameWindow.height * 0.1);
    display.font = '12px Consolas';
    display.fillText('[ENTER] START', gameWindow.width * 0.75, gameWindow.height * 0.86);
    display.fillText('[F5] Restart [F11] FULL Screen', gameWindow.width * 0.75, gameWindow.height * 0.89);
    return {
      gameWindow: gameWindow,
      display: display,
    }
}

function gameScreen(displayObject) {
  const display = new Display(document, 400, 1000);
  titleScreen(display);

  const airplane = new Hero(
    display.gameWindow.width*0.025,
    display.gameWindow.height/2,
    display.gameWindow.width*0.04,
    display.gameWindow.height*0.05,
    document.getElementById('vehicle'),
    'img',
    true, 
    document
  );

  function EnemyBuilder (count, space) {
    for (let i = 0; i <= count-1; i+=1 ) {
      space += 50;
      const enemy = new Enemy(
        display.gameWindow.width + space,
        display.gameWindow.height,
        display.gameWindow.width*0.1/2,
        display.gameWindow.height*0.1,
        document.getElementById('ufo'),
        'img',
        true
      );
      display.addObject(enemy);
    }
  }
  
  EnemyBuilder(5, 50);
  display.addObject(airplane);

  let activeKeys = {};
  document.addEventListener("keydown", function (event) {
    console.log(event.key);
    activeKeys[event.key] = true;
    if ( event.key !== ' ' ) { 
      activeKeys[event.key] = true;
    }
  });

  let start = false;
  document.addEventListener("keypress", function (event) {
    if (event.key === ' ' ) airplane.shoot(display);
    if (event.key === 'Enter' ) start = true;
  });

  document.addEventListener("keyup", function (event) {
    delete activeKeys[event.key];
  });

  let counter = 10;
  let gameOver = false;
    const game = setInterval( function () {
      if ( start ) { 
      if (airplane.x_pos > airplane.start_x_pos && !activeKeys['ArrowRight'] ) {
        airplane.break();
      }
      if ( activeKeys['ArrowUp'] ) airplane.move(-1);
      if ( activeKeys['ArrowDown'] ) airplane.move(1);
      if ( activeKeys['ArrowRight'] ) airplane.accelerate();
      if ( activeKeys['ArrowLeft'] ) airplane.break(true);
      if ( activeKeys['Control'] ) {
        airplane.activateShield(true);
      } else { 
        airplane.shield = false;
        if ( airplane.accelerate === 0 ) airplane.symbol = document.getElementById('vehicle');
        if ( airplane.shieldPower < 100 ) airplane.shieldPower = airplane.shieldPower + 1;
      } 
      let shots = [];
      let ufos = [];
      for (let i = 0; i <= display.objectRepository.length; i+=1 ) {
        let object = display.objectRepository[i];
        if ( object instanceof Enemy) {
          ufos.push(object);
        }
        if ( object instanceof Ammo) {
          shots.push(object);
        }
      };
  
      if (shots.length >= 1) {
        shots.forEach( (shot, i) => {
          if ( shot.isAmmoOfhero ) {
            shot.x_pos = shot.x_pos + airplane.width * 0.2;
          }
          if ( !shot.isAmmoOfhero ) {
            shot.x_pos = shot.x_pos - airplane.width * 0.1;
          }
        });
      }
  
      ufos.forEach ( (ufo) => {
        ufo.shoot( airplane, 50, display );
        ufo.move(display);
        if (distance(airplane, ufo) && airplane.alive && !ufo.alive && !ufo.itemTaken ) {
          const itemType = ufo.getItem();
          if ( itemType === 'ammo' ) airplane.addAmmo(5);
          if ( itemType === 'health' ) display.addHealthToHealthBar(5);
          display.addNumberToScore(5);
        }
  
        if (distance(airplane, ufo) && airplane.alive && ufo.alive ) {
          display.addNumberToScore(-10);
          display.health = display.health - 1;
        }
  
        shots.forEach( (shot, i) => {
          // only shots should hit that haven't actually hit
          // inactive shots do not have a symbol
          if (distance(shot, ufo) && shot.alive && shot.isAmmoOfhero && ufo.alive ) {
            shot.alive = false;
            ufo.dropItem();
            display.addNumberToScore(10);
          }
          if (distance(shot, airplane) && shot.alive && !shot.isAmmoOfhero && !airplane.shield ) {
            shot.set('symbol', document.getElementById('white'));
            shot.alive = false;
            display.addNumberToScore(-5);
            display.health = display.health - 20;
          }
        });
      });
  
      // CleanUp 
      display.objectRepository = display.objectRepository.filter( ( object ) => {
        // Enemy Cleanup 
        // Take only enemies that are visible
        if ( object instanceof Enemy && object.x_pos > 0 ) {
          // Take only enemy items (items dropped by enemies)
          if ( !object.alive && !object.itemTaken ) {
            return object;
          // Or take aliens that are still alive 
          } else if ( object.alive && !object.itemTaken ) {
            return object;
          }
        }
        if ( object.alive && !object.itemTaken && object instanceof Enemy && object.x_pos > ( -1 * ( object.width * 5 ) ) ) {
          return object;
        }
        if ( object instanceof Enemy && !object.alive && !object.itemTaken ) {
          return object;
        }
        if ( object.alive === true && ( object.x_pos <= display.gameWindow.width && !object instanceof Ammo ) ) {
          return object;
        }
        if ( object instanceof Ammo && ( object.x_pos > 0 && object.x_pos < display.gameWindow.width ) ) {
          return object;
        }
        if ( object instanceof Hero ){
          return object;
        }
      });
      const ufoCounter = display.objectRepository.filter( ( object ) => {
        if ( object instanceof Enemy && object.x_pos > 0 ) {
          return object;
        }
      }).length;
  
      if (ufoCounter === 0) {
        EnemyBuilder(counter, 50);
        counter = Math.round( counter * 1.2);
      }
  
      if ( display.health <= 0 ) {
        display.gameOver();
        clearInterval(game);
      }
  
      if ( ufoCounter > 0 ) {
        ufos.forEach(( ufo ) => {
          if ( ufo.x_pos < 0 - ufo.width && ufo.alive ) {
            display.gameOver();
            ufos = [];
            clearInterval(game);
            return;
          }
        });
      } 
      display.refresh();
      // console.log(display.objectRepository.length);
    }
  }, 10); 
}; 

window.onload = function () { 
  let displayObject = titleScreen();
  gameScreen(displayObject);
}



