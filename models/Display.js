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
  }
  addNumberToscore(x) {
    this.score = this.score + x; 
    if (this.score < 0) this.score = 0; 
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
      if (y >= this.gameWindow.height - 20) y -= 20;
      if (y <= 10) y += 20;
      if ( x < 0 ) {
        console.log(x); 
        console.log(object); 
      }
      object.set('y_pos', y);
      this.gameWindow.font = '25px  Consolas';
      this.score = this.score ? this.score : 0; 
      this.canvas.fillText(` Score: ${this.score}`, 400, 20);
      if (object.symbolType === 'img' ) this.canvas.drawImage(object.get('symbol'), x, y, object.height, object.width);
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