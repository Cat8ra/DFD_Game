class Tank extends Actor{
  static SIZE = 2;
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0, hp = 1, team = 0){
	super(pos_x, pos_y, dir);
    this.texture = texture;
	this.state = {name : "idle"};
	this.shoot_cooldown = 0;
    this.move_turns = 0;
	this.size = Tank.SIZE;
	this.speed = 2/16;
    this.hp = hp;
    this.level = 1;
    this.bullets_speed = 3/16;
    this.max_shoot_cooldown = 32;
    this.team = team;
  }
  upgrade(){
      if (this.level < 4){
          this.level++;
          this.texture++;
      }
      switch(this.level){
        case 2: 
          this.bullets_speed = 6/16;
          break;
        case 3:
          this.max_shoot_cooldown = 16;
          break;
        case 4:
          this.hp++;
          break;
      }
  }
}