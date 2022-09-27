class Tank extends Actor{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0){
	super(pos_x, pos_y, dir);
    this.texture = texture;
	this.state = {name : "idle"};
	this.shoot_cooldown = 0;
    this.move_turns = 0;
	this.size = 2;
	this.speed = 2/16;
  }
}