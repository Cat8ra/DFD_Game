class Tank extends Actor{
  static SIZE = 2;
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0, hp = 1){
	super(pos_x, pos_y, dir);
    this.texture = texture;
	this.state = {name : "idle"};
	this.shoot_cooldown = 0;
    this.move_turns = 0;
	this.size = Tank.SIZE;
	this.speed = 2/16;
    this.hp = hp;
  }
}