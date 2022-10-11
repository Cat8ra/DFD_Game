class Actor{
	constructor(pos_x = 0, pos_y = 0, dir = Direction.Up){
        this.x = pos_x;
        this.y = pos_y;
        this.direction = dir;
    }
	onWrongMove(){}
    onVictim(){}
}