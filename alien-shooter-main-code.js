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
      symbolType
    ) {
      this.x_pos = x_pos;
      this.y_pos = y_pos;
      this.height = height;
      this.width = width;
      this.symbol = symbol;
      this.alive = true;
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
      symbolType
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType
      );
    }
    shoot(display) {
      let shotCounter = document.getElementById('shots');
      shotCounter.innerText = parseInt(shotCounter.innerText)+1;
      const shot = new Ammo(
        this.x_pos,
        this.y_pos+22, // this should be done relatively in the future 
        1,
        1,
        '.',
        'char'
      );
      display.addObject(shot);
    }
    move(direction) {
      this.y_pos = this.y_pos + ( this.height * 0.05 * direction );
    }
  }

  class Ammo extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType
      );
    }
  }

  class Enemy extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType
      );
      this.y_pos = Math.round(Math.random()*y_pos);
      this.x_pos = x_pos;
      this.direction = 1;
    }
    move() {
      if ( this.y_pos < 280 ) {
        this.y_pos = this.y_pos + 1 * this.direction;
      }
      if ( this.y_pos > 240 ) {
        this.direction = -1;
        this.y_pos = this.y_pos + 1 * this.direction;
      }
      if ( this.y_pos < 50 ) {
        this.direction = 1;
        this.y_pos = this.y_pos + 1 * this.direction;
      }

      this.x_pos = this.x_pos - 2;
    }
  }

  class Display {
    constructor(height, width) {
      if (typeof Display.instance === 'object') {
        return Display.instance;
      }
      document.getElementById('gameWindow').height = height;
      document.getElementById('gameWindow').width = width;
      this.gameWindow = document.getElementById('gameWindow');
      this.canvas = this.gameWindow.getContext("2d");
      this.objectRepository = [];
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
    refresh() {
      this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
      this.canvas.font = `${this.gameWindow.width*0.025}px Windings`;
      this.objectRepository.forEach((object) => {
        let x = object.get('x_pos'),
          y = object.get('y_pos');
        if (y >= this.gameWindow.height - 20) y -= 20;
        if (y <= 10) y += 20;
        object.set('y_pos', y);
        if (object.symbolType === 'img') this.canvas.drawImage(object.get('symbol'), x, y);
        if (object.symbolType === 'char') this.canvas.strokeText(object.get('symbol'), x, y);
      });
    }
  }

  const display = new Display(400, 1000);

  const airplane = new Hero(
    display.gameWindow.height*0.025,
    display.gameWindow.height/2,
    display.gameWindow.height*0.5,
    display.gameWindow.height*0.5,
    document.getElementById('vehicle'),
    'img'
  );

  function EnemyBuilder (count, space) {
    for (let i = 0; i <= count-1; i+=1 ) {
      space += 50;
      const enemy = new Enemy(
        display.gameWindow.width - space,
        display.gameWindow.height,
        50,
        50,
        '\u{1F6F8}',
        'char'
      );
      display.addObject(enemy);
    }
  }
  
  EnemyBuilder(2, 50);
  display.addObject(airplane);

  document.addEventListener("keydown", function (event) {
    const key = event.key;
    console.log(key);
    if (key === 'w' || (key === 'w' && key === ' ' 
    ) ) airplane.move(-1);
    if (key === 's') airplane.move(1);
    if (key === ' ') airplane.shoot(display);
  });
  let counter = 4;
  setInterval( function () {
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
      shots.forEach( (shot, i) => {
        if (distance(shot, ufo) <= ufo.height * 0.59 ) {
          ufo.set('symbol', '');
        }
      });
    });

    // CleanUp 
    display.objectRepository = display.objectRepository.filter( ( object ) => {
      if ( object instanceof Enemy && object.x_pos > 0 ) {
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
      counter = Math.round(counter * 1.2);
    }

    display.refresh();
    console.log(display.objectRepository.length);
  }, 10);
}



