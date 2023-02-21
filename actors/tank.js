class Tank extends Actor{
  static SIZE = 2;
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0, hp_ = 1, team = 0){
	super(pos_x, pos_y, dir);
    this.texture = texture;
	this.state = {name : "idle"};
	this.shoot_cooldown = 0;
    this.move_turns = 0;
	this.size = Tank.SIZE;
	this.speed = 2/16;
    this.hp = hp_;
    this.level = 1;
    this.bullets_speed = 3/16;
    this.max_shoot_cooldown = 32;
    this.team = team;
    this.live_bullets = 0;
    this.max_bullets = 1;
    
    const colors = {
            0: 0xFFFFFF,
            1: 0x00FF00,
            2: 0x7700FF,
            3: 0xFF0000
        };

    this.color = colors[Math.floor(this.texture / 8)];

    this.setSprites();
  }

  setSprites(){
      this.sprites = [];
      for (let dt of [0, 1, 2, 3]){
          this.sprites[this.texture + dt] = new PIXI.AnimatedSprite(spriteSheet.animations["tank" + (dt + 1)]);
          this.sprites[this.texture + dt].scale.x = 2;
          this.sprites[this.texture + dt].scale.y = 2;
          this.sprites[this.texture + dt].tint = this.color;
      }
      tankContainer.addChild(this.sprites[this.texture]);
      this.sprites[this.texture].alpha = 0;
      //console.log(this);
  }

  upgrade(){
      if (this.level < 4){
          tankContainer.removeChild(this.sprites[this.texture]);
          this.level++;
          this.texture++;
          tankContainer.addChild(this.sprites[this.texture]);
      }
      switch(this.level){
        case 2:
          this.bullets_speed = 6/16;
          break;
        case 3:
          this.max_bullets = 2;
          break;
        case 4:
          this.hp++;
          break;
      }
  }

  kill(){
      this.to_delete = true;

      for (let spar of this.sprites){
          if (spar !== undefined) {
              tankContainer.removeChild(spar);
          }
      }
  }

  onStartMoving(){
      this.sprites[this.texture].play();
  }

  onStopMoving(){
      this.sprites[this.texture].gotoAndStop(0);
  }
}