import Figure from './Figure.js';

export default class Ammo extends Figure {
    constructor(
      x_pos,
      y_pos,
      height,
      width,
      symbol,
      symbolType,
      alive,
      isAmmoOfhero
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
      this.isAmmoOfhero = isAmmoOfhero;
    }
  }