class Bullet extends Actor{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, speed = 3/16, tank){
	super(pos_x, pos_y, dir);
    
	this.size = 1/2;
	this.speed = speed;
    this.tank = tank;
    this.team = this.tank.team;
    this.tank.live_bullets++;

    this.setSprite();
  }

  setSprite(){
      this.sprite = PIXI.Sprite.from(spriteSheet.textures.bullet);

      this.sprite.alpha = 0;
      bulletContainer.addChild(this.sprite);
  }
  get texture_x(){
	  return 322 + 8 * (this.direction % 2 === 0 ? this.direction : 4 - this.direction);
  }
  get texture_y(){
	  return 102;
  }
  onWrongMove(){
	  this.kill();
      //console.log("!\\!");
  }
  onVictim(tank){
      if (tank.team === this.team){
          return;
      }
      tank.hp--;
      if (tank === user_tank){
          field.effects.push(new TankDeathEffect(tank.x, tank.y, tank.size));
      }
      console.log(tank.hp);
      if (tank.hp === 0){
          if (tank !== user_tank){
              field.effects.push(new TankDeathEffect(tank.x, tank.y, tank.size));
          }
          tank.kill(); //TODO tank.hit();
          if (tank.ai !== undefined){ // OfficerII
               field.consGen.setNext(Math.floor(tank.x), Math.floor(tank.y));
          }
      }
      else if (tank === user_tank){
          tank.x = tank.y = 2;
      }
      this.kill();
      //console.log("!\\!");
  }
  onBullet(bullet){
      this.kill();
      bullet.kill();
      //console.log("!\\!");
  }

  kill(){
      if (this.to_delete !== true)
          this.tank.live_bullets--;
      this.to_delete = true;
      bulletContainer.removeChild(this.sprite);
  }
}