export default class Figure {
    constructor(
        x_pos,
        y_pos,
        height,
        width,
        symbol,
        symbolType,
        alive
    ) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.height = height;
        this.width = width;
        this.symbol = symbol;
        this.alive = alive;
        this.symbolType = symbolType;
    }
    // pretty ineffective. Might be removed later. 
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
