class ConsumableStar extends Consumable{
  constructor(pos_x = 0, pos_y = 0){
	super(pos_x, pos_y, 3);
  }
  onConsume(tank){
      tank.upgrade();
      this.to_delete = true;
  }
}