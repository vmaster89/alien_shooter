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
    }
    set(attr, value) {
      this[attr] = value;
    }
    get(attr) {
      return this[attr];
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
      console.log('Hero');
      this.shots = [];
    }
    shoot() {
      this.shots.push(
        new Figure(
          this.x_pos,
          this.y_pos,
          1,
          1,
          '-'
        )
      );
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
      console.log('enemy');
      this.direction = 1;
    }
  }

  class Display {
    constructor(height, width) {
      if (typeof Display.instance === 'object') {
        return Display.instance;
      }
      document.getElementById('gameWindow').height = height;
      document.getElementById('gameWindow').width = width;
      const canvas = document.getElementById('gameWindow');
      this.canvas = canvas.getContext("2d");
      this.objectRepository = [];
    }
    addObject(object) {
      this.objectRepository.push(object);
    }
    refresh() {
      this.canvas.clearRect(0, 0, 400, 450);
      this.objectRepository.forEach((object) => {
        this.canvas.font = "30px Windings";
        let x = object.get('x_pos'),
          y = object.get('y_pos');
        if (y >= 290) y -= 20;
        if (y <= 10) y += 20;
        object.set('y_pos', y);
        this.canvas.strokeText(object.get('symbol'), x, y);
      });
    }
  }

  const display = new Display(300, 400);
  const airplane = new Hero(
    20,
    150,
    50,
    50,
    '\u{2708}'
  );
  const ufo = new Enemy(
    300,
    200,
    50,
    50,
    '\u{1F6F8}'
  );
  display.addObject(ufo);
  display.addObject(airplane);
  display.refresh();

  document.addEventListener("keypress", function (event) {
    const key = event.key;
    let x = airplane.get('x_pos'),
      y = airplane.get('y_pos');
    if (key === 'w') y = y -= 10;
    if (key === 's') y = y += 10;
    if (key === ' ') airplane.shoot();
    airplane.set('y_pos', y);
    display.refresh();
  });

  setInterval(function () {
    let ufo_y = ufo.get('y_pos');
    let ufo_dir = ufo.get('direction');
    if (ufo_y < 280) {
      ufo.set('y_pos', ufo_y + 10 * ufo_dir);
    }
    if (ufo_y > 240) {
      ufo.set('direction', -1);
      ufo.set('y_pos', ufo_y + 10 * ufo_dir);
    }
    if (ufo_y < 50) {
      ufo.set('direction', 1);
      ufo.set('y_pos', ufo_y + 10 * ufo_dir);
    }

    let shots = airplane.get('shots');
    shots.forEach( (shot) => {
      let x = shot.get('x_pos');
      shot.set('x_pos', x + 10);
      display.addObject(shot); 
      if (distance(shot, ufo) <= 5) {
        ufo.set('symbol', '');
      }
    });

    display.refresh();
  }, 100);
}



