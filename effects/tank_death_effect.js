class TankDeathEffect extends Effect{
	constructor(pos_x = 0, pos_y = 0, size = 1){
        super(pos_x, pos_y, size);
        this.phase = 0;
        this.turns_left = 8;
    }
    next_turn(){
        if (this.turns_left === 0){
            this.phase++;
            this.turns_left = 8;
        }
        this.turns_left--;
        if (this.phase > 2){
            this.to_delete = true;
        }
    }
}