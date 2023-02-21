class ConsumableStar extends Consumable{
  constructor(pos_x = 0, pos_y = 0){
	super(pos_x, pos_y, 3);
  }
  onConsume(tank){
      tank.upgrade();
      this.kill();
  }
  kill(){
      this.to_delete = true;
      consContainer.removeChild(this.sprite);
  }
  setSprite(){
      this.sprite = PIXI.Sprite.from(spriteSheet.textures.consumable_star); //`Star`
      consContainer.addChild(this.sprite);
  }
}