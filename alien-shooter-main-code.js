/*
  Alien Shooter 1.0 alpha 
  Move up: w
  Move down: s
  Shoot: Space (can only shoot again if ammo is off screen)
*/
window.onload = function () {
  const distance = (o1, o2) => {
    const x_square = Math.pow( o2.get('x_pos') - o1.get('x_pos'), 2 );
    const y_square = Math.pow( o2.get('y_pos') - o1.get('y_pos'), 2 );
    return Math.sqrt( x_square + y_square );
    /*if ( o1.x_pos > o2.x_pos + o2.width || 
          o1.x_pos + o1.width < o2.x_pos || 
          o1.y_pos > o2.y_pos + o2.height || 
          o1.y_pos + o1.height < o2.y_pos )
      {
        return 100;
      } else {
        return 0;
      }*/
  }

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
    }
    shoot(display) {
      if ( this.ammo <= 0 ) return;
      this.ammo -= 1;
      const shot = new Ammo(
        this.x_pos,
        this.y_pos+22, // this should be done relatively in the future 
        1,
        1,
        '.',
        'char',
        true
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
      this.y_pos = this.y_pos + ( this.height * 0.01 * direction );
    }
    accelerate() {
      this.acceleration = this.acceleration + 0.2;
      if ( this.x_pos < ( this.start_x_pos * 20 ) ) {
        this.speed = 0.1 * this.acceleration;
        this.x_pos = this.x_pos + this.speed;
      }
    }
    break(manual) {
      this.backspeed = this.backspeed || 0.1;
      if ( manual && this.backspeed > 0 ) this.backspeed = 0.5;
      if ( this.acceleration >= 4 ) this.acceleration = 0;
      if ( this.x_pos > ( this.start_x_pos ) && !(this.x_pos <= 0 )) {
        this.backspeed = ( this.backspeed * 1.1 ) - ( ( this.backspeed ) * (-0.5) );
        this.x_pos = this.x_pos - this.backspeed;
      }
      this.backspeed = 0;
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
      this.direction = 1;
      this.alive = alive;
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
  }

  class Display {
    constructor(height, width) {
      if (typeof Display.instance === 'object') {
        return Display.instance;
      }
      this.stop = false;
      document.getElementById('gameWindow').height = height;
      document.getElementById('gameWindow').width = width;
      this.gameWindow = document.getElementById('gameWindow');
      this.background = [];
      for (let i = 0; i < 2; i += 1) {
        this.background.push({
          image: document.getElementById('bg'),
          x_pos: 0,
        });
      }
      this.background[1].x_pos = this.gameWindow.width;
      this.bg_x_pos = 0;
      this.canvas = this.gameWindow.getContext("2d");
      this.canvas.font = '25px Consolas';
      this.objectRepository = [];
      this.highscore = 0;
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
          x_pos: this.gameWindow.width,
        });
      }
    }
    refresh() {
      if ( this.stop ) return;
      this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
      this.drawBackground();
      this.objectRepository.forEach((object) => {
        let x = object.get('x_pos'),
          y = object.get('y_pos');
        if (y >= this.gameWindow.height - 20) y -= 20;
        if (y <= 10) y += 20;
        object.set('y_pos', y);
        this.canvas.strokeText(` Score: ${this.highscore}`, 400, 20);
        if (object.symbolType === 'img' ) this.canvas.drawImage(object.get('symbol'), x, y);
        if (object.symbolType === 'char' ) this.canvas.strokeText(object.get('symbol'), x, y);
        if ( typeof object.ammo !== 'undefined' ) this.canvas.strokeText('Ammo: ' + object.get('ammo') + ' / 10', 0, 20);
      });
    }
    gameOver() {
      this.stop = true;
      this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
      this.canvas.font = `100px Arial`;
      this.canvas.strokeText('Game OVER!', this.gameWindow.width * 0.10, this.gameWindow.height * 0.25 );
      this.canvas.strokeText(`Highscore: ${this.highscore}`, this.gameWindow.width * 0.10, this.gameWindow.height * 0.5 );
    }
  }

  const display = new Display(400, 1000);

  const airplane = new Hero(
    display.gameWindow.height*0.025,
    display.gameWindow.height/2,
    display.gameWindow.height*0.5,
    display.gameWindow.height*0.5,
    document.getElementById('vehicle'),
    'img',
    true
  );

  function EnemyBuilder (count, space) {
    for (let i = 0; i <= count-1; i+=1 ) {
      space += 50;
      const enemy = new Enemy(
        display.gameWindow.width - space,
        display.gameWindow.height,
        50,
        50,
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
    activeKeys[event.key] = true;
    if ( event.key !== ' ' ) { 
      activeKeys[event.key] = true;
    }
  });

  document.addEventListener("keypress", function (event) {
    if (event.key === ' ' ) airplane.shoot(display);
  });

  document.addEventListener("keyup", function (event) {
    delete activeKeys[event.key];
  });

  let counter = 4;
  this.gameOver = false;
  const game = setInterval( function () {
    if (airplane.x_pos > airplane.start_x_pos && !activeKeys['ArrowRight'] ) {
      airplane.break();
    }
    if ( activeKeys['ArrowUp'] ) airplane.move(-1);
    if ( activeKeys['ArrowDown'] ) airplane.move(1);
    if ( activeKeys['ArrowRight'] ) airplane.accelerate();
    if ( activeKeys['ArrowLeft'] ) airplane.break(true);
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
        shot.x_pos = shot.x_pos + airplane.height * 0.01;
      });
    }

    ufos.forEach ( (ufo) => {
      ufo.move();
      if (distance(airplane, ufo) <= ufo.height * 0.59 && airplane.alive && !ufo.alive ) {
        ufo.set('symbolType', 'char'); 
        display.highscore = display.highscore + 5;
        ufo.set('symbol', '');
        airplane.addAmmo(1);
      }

      if (distance(airplane, ufo) <= ufo.height * 0.59 && airplane.alive && ufo.alive ) {
        display.highscore = display.highscore - 10;
      }

      shots.forEach( (shot, i) => {
        // only shots should hit that haven't actually hit
        // inactive shots do not have a symbol
        if (distance(shot, ufo) <= ufo.height * 0.25 && shot.alive && ufo.alive ) {
          shot.set('symbol', ' ');
          shot.alive = false;
          display.highscore = display.highscore + 10;
          ufo.set('symbol', document.getElementById('ammo'));
          ufo.alive = false;
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
      if ( object instanceof Ammo && object.x_pos < display.gameWindow.width ) {
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
  }, 10);
}



