class Officer extends AI{
    constructor(field, tank){
        super();
        this.field = field;
        this.tank = tank;
        this.look_cooldown = 6;
        this.look_in = 0;
        
        this.changeDirection(); //for dumb turns
    }
    turn(){
        if (this.tank.move_turns === 0){
            if (this.field.grid[Math.floor(this.field.user_tank.y)][Math.floor(this.field.user_tank.x)] === Cell.Grass){
                //console.log("dumb");
                return this.dumbTurn();
            }
            if (this.look_in === 0){
                this.path = this.getPath();
                this.look_in = this.look_cooldown;
            }
            
            let step = this.path.shift();
            //console.log(this.path);
            if (step !== undefined){
                this.field.callTankMove(this.tank, step);
            }
            this.look_in--;
        }
        this.field.callTankShoot(this.tank);
    }
    getPath(){
        let path = this.field.getPath({x: this.tank.x, y: this.tank.y}, 
                                 {x: Math.floor(this.field.user_tank.x), y: Math.floor(this.field.user_tank.y)});
        let res = new Array();
        let now = {x: this.tank.x, y: this.tank.y};
        for (let cell of path){
            if (cell.x === now.x - 1){
                res.push(Direction.Left);
            }
            else if (cell.x === now.x + 1){
                res.push(Direction.Right);
            }
            else if (cell.y === now.y - 1){
                res.push(Direction.Up);
            }
            else if (cell.y === now.y + 1){
                res.push(Direction.Down);
            }
            now.x = cell.x;
            now.y = cell.y;
        }
        return res;
    }
    
    changeDirection(){
        this.direction = Math.floor(Math.random() * 4);
        this.cells = Math.floor(Math.random() * 8) + 3;
    }
    
    dumbTurn(){
        if (this.cells === 0){
            this.changeDirection();
        }
        this.field.callTankMove(this.tank, this.direction);
        this.cells--;
        this.field.callTankShoot(this.tank);
    }
}