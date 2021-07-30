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
          this.x_pos+(this.y_pos*0.01),
          this.y_pos-(this.y_pos*0.01),
          1,
          1,
          '.'
        )
      );
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
    refresh() {
      this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
      this.objectRepository.forEach((object) => {
        this.canvas.font = `${this.gameWindow.width*0.025}px Windings`;
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
  const ufo = new Enemy(
    this.gameWindow.width - ( this.gameWindow.width * 0.05 ),
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
    console.log(key);
    if (key === 'w' || key.includes('w', ' ')) airplane.move(-1);
    if (key === 's' || key.includes('s', ' ')) airplane.move(1);
    if (key === ' ') airplane.shoot();
    display.refresh();
  });

  setInterval(function () {
    let ufo_y = ufo.get('y_pos'),
        ufo_x = ufo.get('x_pos');
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

    ufo.set('x_pos', ufo_x - 5);

    let shots = airplane.get('shots');
    shots.forEach( (shot) => {
      let x = shot.get('x_pos');
      shot.set('x_pos', x + 10);
      display.addObject(shot); 
      if (distance(shot, ufo) <= ufo.height * 0.5 ) {
        setTimeout ( function () {
          ufo.set('symbol', '\u{1F4A2}');
        }, 100);
      }
    });

    display.refresh();
  }, 100);

  const selectResolution = document.getElementById('resolution');
  selectResolution.addEventListener('click', function () {
    const option = selectResolution.value;
    console.log(option);
    display.setResolution(option);
    display.refresh();
  });
}



