import Figure from './Figure.js';
import Ammo from './Ammo.js';

export default class Hero extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive, 
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
      this.shield = false;
      this.shieldPower = 100;
    }
    shoot(display) {
      if ( this.ammo <= 0 ) return;
      let shot_sound = document.getElementById('shot_sound');
      shot_sound.play();
      this.ammo -= 1;
      const shot = new Ammo(
        this.x_pos,
        this.y_pos+22, // this should be done relatively in the future 
        15,
        2,
        document.getElementById('shot'),
        'img',
        true, // alive 
        true // heroAmmo
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
      this.y_pos = this.y_pos + ( this.height * 0.05 * direction );
    }
    accelerate() {
      this.acceleration = this.acceleration + 0.4;
      if ( this.x_pos < ( this.start_x_pos * 20 ) ) {
        this.speed = 0.1 * this.acceleration;
        this.x_pos = this.x_pos + this.speed;
      }
      this.symbol = document.getElementById('vehicle_faster');
    }
    break(manual) {
      this.symbol = document.getElementById('vehicle');
      this.backspeed = this.backspeed || 0.1;
      if ( manual && this.backspeed > 0 ) this.backspeed = 1.1;
      if ( this.acceleration >= 4 ) this.acceleration = 0;
      if ( this.x_pos > ( this.start_x_pos ) && !(this.x_pos <= 0 )) {
        this.backspeed = ( this.backspeed * 1.2 ) - ( ( this.backspeed ) * (-0.5) );
        this.x_pos = this.x_pos - this.backspeed;
      }
      this.backspeed = 0;
    }
    activateShield(activation) {
        this.acceleration = 0;
      console.log(this.acceleration);
      if ( activation && this.acceleration === 0 && this.shieldPower >= 1 ) {
        this.shield = true;
        this.symbol = document.getElementById('vehicle_shield');
        this.shieldPower = this.shieldPower - 1;
      } else {
        this.shield = false; 
        this.symbol = document.getElementById('vehicle');
      }
    }
  }