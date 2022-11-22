class Bullet extends Actor{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, speed = 3/16, team = 0){
	super(pos_x, pos_y, dir);
    
	this.size = 1/2;
	this.speed = speed;
    this.team = team;
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
      if (tank.team == this.team){
          return;
      }
      tank.hp--;
      if (tank.hp === 0){
          tank.to_delete = true; //TODO tank.hit();
          if (tank.ai !== undefined){ // OfficerII
               field.consGen.setNext(Math.floor(tank.x), Math.floor(tank.y));
          }
      }
      this.to_delete = true;
  }
  onBullet(bullet){
      this.to_delete = true;
      bullet.to_delete = true;
  }
}