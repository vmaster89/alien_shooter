import Figure from './Figure.js';
import Ammo from './Ammo.js';

const Movement = {
  1: function (display, speed) {
    // console.log(this.y_pos >= display.gameWindow.height - ( 2 * Math.round( this.height ) ));
    if ( this.y_pos < display.gameWindow.height ) {
      this.y_pos = this.y_pos + 1 * this.direction;
    }
    if ( this.y_pos >= display.gameWindow.height - ( 2 * Math.round( this.height ) + 1 ) ) {
      this.direction = -1;
      this.y_pos = this.y_pos + 1 * this.direction;
    }
    if ( this.y_pos < this.height ) {
      this.direction = 1;
      this.y_pos = this.y_pos + 1 * this.direction;
    }
    this.x_pos = this.x_pos - speed;
  },
  2: function (display, speed) {
      // j = speed (also influences the curves)
      this.j = 1;
      this.x_pos = this.x_pos - speed;
      // X can increase curve sizes : Math.sin( X * this.x_pos )
      // https://jsfiddle.net/6hv70wen/
      this.y_pos = this.y_pos + Math.sin( 1/50 * this.x_pos );
  }
}

export default class Enemy extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive,
      enemyWeapon,
      enemyType,
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
      let min = this.height * 1;
      let max = this.height * 20;
      this.y_pos = Math.floor( Math.random() * (  max - min + 1 ) ) + min;
      this.x_pos = x_pos;
      this.enemyWeapon = enemyWeapon;
      this.alive = alive;
      /*if ( this.x_pos <= display.gameWindow.width * 0.5) {
        this.x_pos = display.gameWindow.width * 0.8;
      }*/
      this.direction = 1;
      this.alive = alive;
      this.symbol = symbol;
      this.inventory = [
        {
          type: 'health',
          symbol: document.getElementById('health'),
        },
        {
          type: 'ammo',
          symbol: document.getElementById('ammo'),
        }
      ]
      this.itemTaken = false;
      this.itemType = null;
      this.height = height; 
      this.width = width;
      this.move = Movement[enemyType];
      this.start_x_pos = this.x_pos;
      this.start_y_pos = this.y_pos;
      this.i = 0;
      this.j = 0;
    }
    getItem() {
      let shot_sound = document.getElementById('coin');
      shot_sound.play();
      this.set('itemTaken', true);
      return this.itemType;
    }
    dropItem(display) {
      let shot_sound = document.getElementById('explosion');
      shot_sound.play();
      // this.set('symbol', document.getElementById('white'));
      this.alive = false;
      this.set('itemTaken', false);
      if ( !this.itemType && Math.round( Math.random() ) > 0.25 ) {
        // console.log('enemyWeapon dropped');
        this.set('symbol', this.inventory[1].symbol);
        this.itemType = 'ammo';
        this.height = display.gameWindow.height * 0.05;
        this.width = display.gameWindow.height * 0.05; 
      } else if ( !this.itemType && Math.round( Math.random() ) > 0.05 ) {
        // console.log('health dropped');
        this.itemType = 'health';
        this.set('symbol', this.inventory[0].symbol);
        this.height = display.gameWindow.height * 0.05;
        this.width = display.gameWindow.height * 0.05; 
      } else {
        this.set('itemTaken', true); 
      }
    }
    /* move(display) {
      
    } */
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
            this.enemyWeapon.width,
            this.enemyWeapon.height,
            this.enemyWeapon.shotSymbol,
            'img',
            this.alive, // alive 
            false // heroenemyWeapon
          ));

          /**
          x_pos,
          y_pos,
          height,
          width,
          symbol,
          symbolType,
          alive,
          isenemyWeaponOfhero */
        }
      //}
    }
  }