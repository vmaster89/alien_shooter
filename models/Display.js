import Ammo from './Ammo.js';
import Enemy from './Enemy.js';

export default class Display {
  constructor(document, height, width) {
    if (typeof this.instance === 'object') {
      return this.instance;
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
    this.background[1].x_pos = this.gameWindow.width-2;
    this.bg_x_pos = 0;
    this.canvas = this.gameWindow.getContext("2d");
    this.canvas.font = '25px Consolas';
    this.objectRepository = [];
    this.score = 0;
    this.health = 100;
    this.highscore = document.cookie.split(';').filter((item) => item.trim().startsWith('highscore='))[0];
    this.highscore = this.highscore ? this.highscore.replace('highscore=', '') : 0;
  }
  addNumberToscore(x) {
    this.score = this.score + x; 
    if (this.score < 0) this.score = 0; 
  }
  addHealthToHealthBar(x) {
    this.health = this.health + x; 
    if (this.health >= 100) this.health = 100; 
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
    this.canvas.drawImage(this.background[0].image, this.background[0].x_pos, 4, this.gameWindow.width, this.gameWindow.height);
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
    this.canvas.rect(width - 110, 10, 100, 2);
    this.canvas.stroke();
    this.canvas.beginPath();
    this.canvas.lineWidth = "10";
    this.canvas.strokeStyle = color;
    this.canvas.rect(width - 110, 10, percent, 2);
    this.canvas.stroke();
  }
  addNumberToScore(x) {
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
      if (y >= this.gameWindow.height - 1) y -= 50;
      if (y <= 1) y += 50;
      /*if ( x < 0 ) {
        console.log(x); 
        console.log(object); 
      }*/
      object.set('y_pos', y);
      this.gameWindow.font = '25px  Consolas';
      this.canvas.fillStyle = 'white';
      // this.score = this.score ? this.score : 0; 
      /* if ( this.score ) */ this.canvas.fillText(` Score: ${this.score ? this.score : 0}`, 400, 20);
      if ( object instanceof Ammo ) {
        if ( object.alive ) this.canvas.drawImage(object.get('symbol'), x, y, object.height, object.width);
      } else if ( object instanceof Enemy ) {
        if ( !object.itemTaken ) this.canvas.drawImage(object.get('symbol'), x, y, object.height, object.width);
      } else {
        this.canvas.drawImage(object.get('symbol'), x, y, object.height, object.width);
      }
      this.gameWindow.font = '25px  Consolas';
      if ( typeof object.ammo !== 'undefined' ) this.canvas.fillText('Ammo: ' + object.get('ammo') + ' / 10', 10, 20);
      this.drawBar(this.gameWindow.width - 140, this.health, 'green');
      if (object.shieldPower) this.drawBar(this.gameWindow.width - 10, object.shieldPower, 'blue');
    });
  }
  gameOver() {
    this.stop = true;
    this.drawBackground();
    // this.canvas.clearRect(0, 0, this.gameWindow.width, this.gameWindow.height);
    var gradient = this.canvas.createLinearGradient(0, 0, this.gameWindow.width, 0);
    gradient.addColorStop("0", "red");
    gradient.addColorStop("0.5", "red");
    gradient.addColorStop("1.0", "green");
    this.canvas.fillStyle = gradient;
    this.canvas.fillText('Game OVER!', this.gameWindow.width * 0.10, this.gameWindow.height * 0.25 );
    if ( this.score > parseInt(this.highscore) ) {
      document.cookie = "highscore=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
      document.cookie = `highscore=${this.score}; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax; Secure`; 
    }
    this.canvas.fillText(`Your Score: ${this.score} | Highscore: ${this.highscore}`, this.gameWindow.width * 0.10, this.gameWindow.height * 0.5 );
  }
}