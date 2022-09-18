class Tank extends Actor{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0){
	super();
    this.x = pos_x;
    this.y = pos_y;
    this.id = Tank.new_id;
    this.direction = dir;
    this.texture = texture;
	this.stat = {name : "idle"};
	this.shoot_cooldown = 0;
    this.move_frames = 0;
	this.size = 2;
	this.speed = 2/16;
  }

  get texture_x() {
    let x = 0;
    if (this.texture > 15)
      x += 128;
    switch (this.direction){
      case Direction.Right:
        x += 96;
        break;
      case Direction.Down:
        x += 64;
        break;
      case Direction.Left:
        x += 32;
        break;
    }
    if (this.move_frames % 2 === 1)
      x += 16;
    return x;
  }
  get texture_y() {
    return (this.texture % 16) * 16;
  }

  static next_id = 0;
  static get new_id() { return Tank.next_id++; }

}