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
      symbol
    ) {
      this.x_pos = x_pos;
      this.y_pos = y_pos;
      this.height = height;
      this.width = width;
      this.symbol = symbol;
      this.alive = true;
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
      symbol
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol
      );
      this.shots = [];
    }
    shoot(display) {
      let shotCounter = document.getElementById('shots');
      shotCounter.innerText = parseInt(shotCounter.innerText)+1;
      const shot = new Figure(
        this.x_pos+(this.y_pos*0.01),
        this.y_pos-(this.y_pos*0.01),
        1,
        1,
        '.'
      );
      this.shots.push(
        shot
      );
      display.addObject(shot);
    }
    move(direction) {
      this.y_pos = this.y_pos + ( this.height * 0.05 * direction );
    }
  }

  class Enemy extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol
    ) {
      super(
        x_pos,
        y_pos,
        height,
        width,
        symbol
      );
      this.y_pos = Math.random()*y_pos;
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
        this.canvas.strokeText(object.get('symbol'), x, y);
      });
    }
  }

  const display = new Display(400, 1000);

  const airplane = new Hero(
    display.gameWindow.height*0.025,
    display.gameWindow.height/2,
    display.gameWindow.height*0.5,
    display.gameWindow.height*0.5,
    '\u{2708}'
  );

  const UfoRepository = [];

  //function createEnemies() {
    let space = 50;
    for ( let i = 0; i < 5; i+=1 ) {
    //setInterval( function () {
      space += 50;
      const enemy = new Enemy(
        display.gameWindow.width - space,
        display.gameWindow.height,
        50,
        50,
        '\u{1F6F8}'
      );
      display.addObject(enemy);
      UfoRepository.push(enemy);
      
    };

  display.addObject(airplane);
  display.refresh();

  document.addEventListener("keypress", function (event) {
    const key = event.key;
    if (key === 'w') airplane.move(-1);
    if (key === 's') airplane.move(1);
    if (key === ' ') airplane.shoot(display);
    display.refresh();
  });

  function loop(timestamp) {
    let shots = airplane.get('shots');
    UfoRepository.forEach( ( ufo, j ) => {
      ufo.move();
      shots.forEach( (shot, i) => {
        let x = shot.get('x_pos');
        shot.set('x_pos', x + airplane.height * 0.005 );
        if (distance(shot, ufo) <= ufo.height * 0.59 ) {
          ufo.set('symbol', '\u{1F4A2}');
          //ufo.destroyed();
        }
      });
    });

    // CleanUp 
    shots.forEach( ( shot, i ) => {
      if ( shot.x_pos > display.gameWindow.width ) {
        shots.splice(i, i+1);
      }
    }); 
    display.objectRepository.forEach( (object, i) => {
      if ( object.x_pos > display.gameWindow.width ) {
        display.objectRepository.splice(i, i+1);
      }
      if ( object.x_pos <= -100 && Object instanceof Enemy) {
        display.objectRepository.splice(i, i+1);
      }
    });

    display.refresh();
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
    console.log(display.objectRepository.length);
    // console.log(shots.length);
  }
  var lastRender = 0;
  window.requestAnimationFrame(loop);
}



