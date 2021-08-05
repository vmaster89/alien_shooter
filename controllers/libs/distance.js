export function distance(o1, o2) {
    /* const x_square = Math.pow( o2.get('x_pos') - o1.get('x_pos'), 2 );
    const y_square = Math.pow( o2.get('y_pos') - o1.get('y_pos'), 2 );
    return Math.sqrt( x_square + y_square );*/
    if (o1.x_pos < o2.x_pos + o2.width &&
        o1.x_pos + o1.width > o2.x_pos &&
        o1.y_pos < o2.y_pos + o2.height &&
        o1.y_pos + o1.height > o2.y_pos) {
        return true;
    }
    return false;
}