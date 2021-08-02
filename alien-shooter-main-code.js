/*
  Alien Shooter 1.0 alpha 
  Move up: Up
  Move down: Down
  Shoot: Space (can only shoot again if ammo is off screen)
*/

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
}


function gameScreen() {
  class Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive
    ) {
      this.x_pos = x_pos;
      this.y_pos = y_pos;
      this.height = height;
      this.width = width;
      this.symbol = symbol;
      this.alive = alive;
      this.symbolType = symbolType;
    }
    set(attr, value) {
      this[attr] = value;
    }
    get(attr) {
      return this[attr];
    }
    destroyed() {
      this.alive = false;
      this.symbol = '';
    }
  }

  class Hero extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType,
        alive
      );
      this.alive = alive;
      this.ammo = 10;
      this.speed = 0;
      this.backspeed = 0;
      this.acceleration = 0;
      this.start_x_pos = x_pos;
      this.shield = false;
      this.shieldPower = 100;
    }
    shoot(display) {
      if ( this.ammo <= 0 ) return;
      let shot_sound = document.getElementById('shot_sound');
      shot_sound.play();
      this.ammo -= 1;
      const shot = new Ammo(
        this.x_pos,
        this.y_pos+22, // this should be done relatively in the future 
        15,
        2,
        document.getElementById('shot'),
        'img',
        true, // alive 
        true // heroAmmo
      );
      display.addObject(shot);
    }
    addAmmo(count) {
      if (this.ammo < 10) {
        this.ammo += count;
        this.ammo = this.ammo > 10 ? 10 : this.ammo;
      }
    }
    move(direction) {
      this.y_pos = this.y_pos + ( this.height * 0.05 * direction );
    }
    accelerate() {
      this.acceleration = this.acceleration + 0.4;
      if ( this.x_pos < ( this.start_x_pos * 20 ) ) {
        this.speed = 0.1 * this.acceleration;
        this.x_pos = this.x_pos + this.speed;
      }
      this.symbol = document.getElementById('vehicle_faster');
    }
    break(manual) {
      this.symbol = document.getElementById('vehicle');
      this.backspeed = this.backspeed || 0.1;
      if ( manual && this.backspeed > 0 ) this.backspeed = 1.1;
      if ( this.acceleration >= 4 ) this.acceleration = 0;
      if ( this.x_pos > ( this.start_x_pos ) && !(this.x_pos <= 0 )) {
        this.backspeed = ( this.backspeed * 1.2 ) - ( ( this.backspeed ) * (-0.5) );
        this.x_pos = this.x_pos - this.backspeed;
      }
      this.backspeed = 0;
    }
    activateShield(activation) {
      console.log(activation);
      if ( activation && this.acceleration === 0 && this.shieldPower >= 1 ) {
        this.shield = true;
        this.symbol = document.getElementById('vehicle_shield');
        this.shieldPower = this.shieldPower - 1;
      } else {
        this.shield = false; 
        this.symbol = document.getElementById('vehicle');
      }
    }
  }

  class Ammo extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive,
      isAmmoOfhero
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType,
        alive
      );
      this.alive = alive;
      this.isAmmoOfhero = isAmmoOfhero;
    }
  }

  class Enemy extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType,
        alive
      );
      this.y_pos = Math.round(Math.random()*y_pos);
      this.x_pos = x_pos;
      /*if ( this.x_pos <= display.gameWindow.width * 0.5) {
        this.x_pos = display.gameWindow.width * 0.8;
      }*/
      this.direction = 1;
      this.alive = alive;
      this.itemTaken = false;
    }
    move() {
      if ( this.y_pos < display.gameWindow.height ) {
        this.y_pos = this.y_pos + 1 * this.direction;
      }
      if ( this.y_pos > display.gameWindow.height - ( this.height ) ) {
        this.direction = -1;
        this.y_pos = this.y_pos + 1 * this.direction;
      }
      if ( this.y_pos < 50 ) {
        this.direction = 1;
        this.y_pos = this.y_pos + 1 * this.direction;
      }
      this.x_pos = this.x_pos - 1;
    }
    shoot( heroPos, pCorrection, display ) {
      // pCorrection influences the probability 
      let shotDecision = ( Math.random() * 100 )  > ( 99.8 ) ? true: false;
      //if ( heroPos.y_pos >= this.y_pos - ( this.y_pos + ( this.height / 2 ) ) &&  heroPos.y_pos > this.y_pos + ( this.height * 2) ) {
        if ( shotDecision && this.alive ) {
          let shot_sound = document.getElementById('shot_enemy');
          shot_sound.play();
          display.addObject(new Ammo(
            this.x_pos,
            this.y_pos+22, // this should be done relatively in the future 
            15,
            2,
            document.getElementById('shot_enemy1'),
            'img',
            true, // alive 
            false // heroAmmo
          ));
        }
      //}
    }
  }

  class Display {
    constructor(height, width) {
      if (typeof Display.instance === 'object') {
        return Display.instance;
      }
      this.stop = false;
      document.getElementById('gameWindow').height = height;
      document.getElementById('gameWindow').width = width;
      this.gameWindow = gameWindow;
      this.background = [];
      for (let i = 0; i < 2; i += 1) {
        this.background.push({
          image: document.getElementById('bg'),
          x_pos: 0,
        });
      }
      this.background[1].x_pos = this.gameWindow.width-2;
      this.bg_x_pos = 0;
      this.canvas = this.gameWindow.getContext("2d");
      this.canvas.font = '25px Consolas';
      this.objectRepository = [];
      this.score = 0;
      this.health = 100;
    }
    setResolution(option) {
      switch (option) {
        case 1: 
          this.gameWindow.height = 786;
          this.gameWindow.width = 1024;
          break;
        case 2: 
          this.gameWindow.height = 720;
          this.gameWindow.width = 1280;
          break;
        default: 
          break;
      }
    }
    addObject(object) {
      this.objectRepository.push(object);
    }
    removeObject(i) {
      // this.objectRepository.slice(i, i+1);
    }
    getObjectInstance(i) {
      return this.objectRepository[i];
    }
    drawBackground () {
      // Use Gameloop
      this.background[0].x_pos = this.background[0].x_pos - 0.5;
      this.canvas.drawImage(this.background[0].image, this.background[0].x_pos, 0, this.gameWindow.width, this.gameWindow.height);
      this.background[1].x_pos = this.background[1].x_pos - 0.5;
      this.canvas.drawImage(this.background[1].image, this.background[1].x_pos, 0, this.gameWindow.width, this.gameWindow.height);
      if ( this.background[0].x_pos <= 0-this.gameWindow.width ) {
        this.background.shift();
        this.background.push({
          image: document.getElementById('bg'),
          x_pos: this.gameWindow.width-2,
        });
      }
    }
    drawBar (width, percent, color) {
      this.canvas.beginPath();
      this.canvas.lineWidth = "10";
      this.canvas.strokeStyle = "red";
      this.canvas.rect(width - 110, 10, 100, 10);
      this.canvas.stroke();
      this.canvas.beginPath();
      this.canvas.lineWidth = "10";
      this.canvas.strokeStyle = color;
      this.canvas.rect(width - 110, 10, percent, 10);
      this.canvas.stroke();
    }
    addNumberToscore(x) {
      // score should never be below zero 
      this.score = this.score + x;
      this.score = this.score <= 0 ? 0 : this.score;
    }
    refresh() {
      if ( this.stop ) return;
      this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
      this.canvas.fillStyle = 'black';
      this.drawBackground();
      this.objectRepository.forEach((object) => {
        let x = object.get('x_pos'),
          y = object.get('y_pos');
        if (y >= this.gameWindow.height - 20) y -= 20;
        if (y <= 10) y += 20;
        object.set('y_pos', y);
        this.gameWindow.font = '25px  Consolas';
        this.canvas.fillText(` Score: ${this.score}`, 400, 20);
        if (object.symbolType === 'img' ) this.canvas.drawImage(object.get('symbol'), x, y, object.height, object.width);
        this.gameWindow.font = '25px  Consolas';
        if ( typeof object.ammo !== 'undefined' ) this.canvas.fillText('Ammo: ' + object.get('ammo') + ' / 10', 10, 20);
        this.drawBar(display.gameWindow.width - 140, this.health, 'green');
        if (object.shieldPower) this.drawBar(display.gameWindow.width - 10, object.shieldPower, 'blue');
      });
    }
    gameOver() {
      this.stop = true;
      this.drawBackground();
      // this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
      this.canvas.font = '100px Arial';
      var gradient = this.canvas.createLinearGradient(0, 0, this.gameWindow.width, 0);
      gradient.addColorStop("0", "red");
      gradient.addColorStop("0.5", "red");
      gradient.addColorStop("1.0", "green");
      this.canvas.fillStyle = gradient;
      this.canvas.fillText('Game OVER!', this.gameWindow.width * 0.10, this.gameWindow.height * 0.25 );
      this.canvas.fillText(`Your Score: ${this.score}`, this.gameWindow.width * 0.10, this.gameWindow.height * 0.5 );
    }
  }

  const display = new Display(400, 1000);
  titleScreen(display);

  const airplane = new Hero(
    display.gameWindow.width*0.025,
    display.gameWindow.height/2,
    display.gameWindow.width*0.04,
    display.gameWindow.height*0.05,
    document.getElementById('vehicle'),
    'img',
    true
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
  
  EnemyBuilder(2, 50);
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

  let counter = 4;
  this.gameOver = false;
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
        if ( airplane.accelerate === 0 )airplane.symbol = document.getElementById('vehicle');
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
        ufo.move();
        if (distance(airplane, ufo) && airplane.alive && !ufo.alive && !ufo.itemTaken ) {
          let shot_sound = document.getElementById('coin');
            shot_sound.play();
          ufo.set('symbolType', 'char'); 
          ufo.set('itemTaken', true);
          // Gives to many points because invisible ufos is also touched 
          display.addNumberToscore(5);
          ufo.set('symbol', '');
          airplane.addAmmo(5);
        }
  
        if (distance(airplane, ufo) && airplane.alive && ufo.alive ) {
          display.addNumberToscore(-10);
          display.health = display.health - 1;
        }
  
        shots.forEach( (shot, i) => {
          // only shots should hit that haven't actually hit
          // inactive shots do not have a symbol
          if (distance(shot, ufo) && shot.alive && shot.isAmmoOfhero && ufo.alive ) {
            let shot_sound = document.getElementById('explosion');
            shot_sound.play();
            shot.set('symbol', document.getElementById('white'));
            shot.alive = false;
            display.addNumberToscore(10);
            ufo.set('symbol', document.getElementById('ammo'));
            ufo.alive = false;
          }
          if (distance(shot, airplane) && shot.alive && !shot.isAmmoOfhero && !airplane.shield ) {
            shot.set('symbol', document.getElementById('white'));
            shot.alive = false;
            display.addNumberToscore(-5);
            display.health = display.health - 5;
          }
        });
      });
  
      // CleanUp 
      display.objectRepository = display.objectRepository.filter( ( object ) => {
        if ( object instanceof Enemy && object.x_pos > 0 ) {
          return object;
        }
        if ( object.alive === true ) {
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
          if ( ufo.x_pos < 0 ) {
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
  /* var song = document.getElementById('background'); 
  song.loop = true;
  song.play(); */
  titleScreen();
  gameScreen();
}



