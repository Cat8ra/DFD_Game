class Consumable extends Actor{
  constructor(pos_x = 0, pos_y = 0, texture){
	super(pos_x, pos_y, undefined);
    this.texture = texture;
    this.size = 2;
  }
  onConsume(tank){
      this.to_delete = true;
  }
}