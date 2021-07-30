/*
	Alien Shooter 1.0 alpha 
	Move up: w
  Move down: s
  Shoot: Space (can only shoot again if ammo is off screen)
*/

class Figure {
	constructor (
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
  set (attr, value) {
  	this[attr] = value;
  }
 	get (attr) {
  	return this[attr];
  }
}

class Enemy extends Figure {
	constructor (
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
  addBackground() {
  
  }
  addObject(object) {
  	this.objectRepository.push(object);
  }
  removeObject(object) {
  	// TODO
  }
 	refresh() {
  	this.canvas.clearRect(0, 0, 400, 450);
  	this.objectRepository.forEach( (object) => {
    	this.canvas.font = "30px Windings";
      let x = object.get('x_pos'),
      		y = object.get('y_pos');
      if ( y >= 290  ) y -= 20;
      if ( y <= 10 ) y += 20;
      object.set('y_pos', y);
      this.canvas.strokeText(object.get('symbol'), x, y);
    });
  }
}

const display = new Display(300, 400);
const airplane = new Figure(
	20,
  150,
  50,
  50,
  '\u{2708}'
);
const ammo = new Figure(
	25,
  10,
  1,
  2,
  '.'
);
const ufo = new Enemy(
	300,
  200,
  50,
  50,
	'\u{1F6F8}'
);
display.addObject(airplane);
display.addObject(ufo);
display.refresh();

const drawAmmo = function (planeX, planeY) {
	let x = ammo.get('x_pos');
  if ( x >= 400 ) ammo.set('x_pos', 50);
	ammo.set('y_pos', planeY)
  display.addObject(ammo);
  display.refresh();
}

document.addEventListener("keypress", function (event) {
	const key = event.key;
  console.log(event.key);
  let x = airplane.get('x_pos'),
			y = airplane.get('y_pos');
  if ( key === 'w' ) y = y-=10;
  if ( key === 's' ) y = y+=10;
  if ( key === ' ' ) drawAmmo(x, y);
  airplane.set('y_pos', y);
  display.refresh();
});

var interval = setInterval(function () {
	let x = ammo.get('x_pos'),
  		y = ammo.get('y_pos');
  ammo.set('x_pos', x + 10);
  let ufo_y = ufo.get('y_pos'),
  		ufo_x = ufo.get('x_pos');
  let ufo_dir = ufo.get('direction');
  if ( ufo_y < 280 ) {
  	ufo.set('y_pos', ufo_y + 10 * ufo_dir );
  }
  if ( ufo_y > 240 ) { 
  	ufo.set('direction', -1);
  	ufo.set('y_pos', ufo_y + 10 * ufo_dir );
  }
 	if ( ufo_y < 50 ) { 
  	ufo.set('direction', 1);
  	ufo.set('y_pos', ufo_y + 10 * ufo_dir );
  }
  
  if ( ( x >= ufo_x && x < ufo_x + 40) && ( y < ufo_y ) ) {
  	ufo.set('symbol', '\u{1F4A5}');
  }
  
  display.refresh();
}, 100);

function myStopFunction() {
  clearInterval(interval);
}
