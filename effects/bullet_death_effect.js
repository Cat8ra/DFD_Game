class BulletDeathEffect extends Effect{
	constructor(pos_x = 0, pos_y = 0, size = 1){
        super(pos_x, pos_y, size);
        this.phase = 0;
        this.turns_left = 8;

        this.setSprites();
    }
    next_turn(){
        if (this.turns_left === 0){
            this.phase++;
            this.turns_left = 8;
        }
        this.turns_left--;
        if (this.phase > 1){
            this.to_delete = true;
            effectContainer.removeChild(this.sprite);
        }
    }
    setSprites(){
        this.sprite = new PIXI.AnimatedSprite(spriteSheet.animations.bullet_death);
        effectContainer.addChild(this.sprite);
        this.sprite.scale.x = 2;
        this.sprite.scale.y = 2;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
    }
}