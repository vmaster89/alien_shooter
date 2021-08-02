import Figure from './Figure.js';
import Ammo from './Ammo.js';

export default class Enemy extends Figure {
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
    move(display) {
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