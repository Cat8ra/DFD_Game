class Bullet extends Actor{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up){
	super(pos_x, pos_y, dir);
    
	this.size = 1/2;
	this.speed = 3/16;
  }
  get texture_x(){
	  return 322 + 8 * (this.direction % 2 === 0 ? this.direction : 4 - this.direction);
  }
  get texture_y(){
	  return 102;
  }
  onWrongMove(){
	  this.to_delete = true;
  }
  onVictim(tank){
      tank.to_delete = true;
      this.to_delete = true;
  }
}