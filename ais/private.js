class Private extends AI{
    constructor(field, tank){
        super();
        this.field = field;
        this.tank = tank;
        this.changeDirection();
    }
    turn(){
        if (this.tank.move_turns === 0){
            if (this.cells === 0){
                this.changeDirection();
            }
            this.field.callTankMove(this.tank, this.direction);
            this.cells--;
        }
        this.field.callTankShoot(this.tank);
    }
    changeDirection(){
        this.direction = Math.floor(Math.random() * 4);
        this.cells = Math.floor(Math.random() * 8) + 3;
    }
}