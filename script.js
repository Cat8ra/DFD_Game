"use strict";
const Direction = { Up: 0, Right: 1, Down: 2, Left: 3};
const Cell = { Empty: 0, Brick: 1, Wall: 2, Grass: 3 };

class Field{
    constructor(width = 50, height = 50){
        this.width = width;
        this.height = height;
    
        this.grid = new Array(height);
        for (let i = 0; i < height; i++){
            this.grid[i] = new Array(width);
            for (let j = 0; j < width; j++){
                this.grid[i][j] = Cell.Empty;
            }
        }
    
        this.tanks = [];
        this.bullets = [];
        this.td_effects = [];
    
        this.tasks = [{type: "field"}];
        this.ais = [];
        
        this.turn_ = 0;
        this.fps = 32;
    
        this.tankShift = new Map([
            [Direction.Up,    ['y',  0,  1, -1, -1, -1, 0]],
            [Direction.Down,  ['y',  0,  1,  1,  1,  1, this.height - 2]],
            [Direction.Left,  ['x', -1, -1,  0,  1, -1, 0]],
            [Direction.Right, ['x',  1,  1,  0,  1,  1, this.width - 2]],
        ]);
    
        this.bulletShift = new Map([
            [Direction.Up,    [ 0, -1]],
            [Direction.Down,  [ 0,  1]],
            [Direction.Left,  [-1,  0]],
            [Direction.Right, [ 1,  0]],
        ]);
    }
  
    addTank(tank){
        this.tanks.push(tank);
    }
    
    addAI(ai){
        this.ais.push(ai);
    }
  
    callTankMove(tank, direction){
        if (tank.move_turns === 0) {
        
            tank.direction = direction;
            const [pos, x1, x2, y1, y2, mult, edge] = this.tankShift.get(direction);

            if (tank[pos] !== edge &&
                this.grid[tank.y + y1][tank.x + x1] == Cell.Empty &&
                this.grid[tank.y + y2][tank.x + x2] == Cell.Empty){
                
                    tank.move_turns = 8;
                    tank.state = { name: "move", 
                                 start: { x: tank.x, y: tank.y },
                             end_cell1: { x: tank.x + x1, y: tank.y + y1 },
                             end_cell2: { x: tank.x + x2, y: tank.y + y2 },
                    };
                }
            else{
                tank.onWrongMove();
            }
        }
    }
  
    callTankShoot(tank){
        if (tank.shoot_cooldown === 0){
            
            const [pos, x1, x2, y1, y2, mult, edge] = this.tankShift.get(tank.direction);
            
            tank.shoot = false;
            tank.shoot_cooldown = 32;
            
            this.bullets.push(new Bullet(tank.x + 1 + (x1 * 20/16) - 4 / 16, 
                                         tank.y + 1 + (y1 * 20/16) - 4 / 16, 
                                         tank.direction));
        }
    }
  
    moveBullet(bullet){
        if (bullet.move_turns < 1) {
                    bullet.state = { name: "move", 
                                     move_turns: bullet.state.move_turns + 1/bullet.speed
                                   };
        }
        
        let x0 = Math.floor(bullet.x);
        let y0 = Math.floor(bullet.y);
        
        for (let i = 0; i < 2; i++){
            for (let j = 0; j < 2; j++){
                this.tasks.push({type: "cell", x: x0 + i, y: y0 + j});
            }
        }
        
        const [dx, dy] = this.bulletShift.get(bullet.direction);
        
        bullet.x += dx * bullet.speed;
        bullet.y += dy * bullet.speed;
        
        if (bullet.x < 0 || bullet.x > this.width - bullet.size || 
            bullet.y < 0 || bullet.y > this.width - bullet.size) { //TODO Wall
                bullet.onWrongMove();   
        }
            
        bullet.state -= bullet.speed;
    }
  
    moveTank(tank){
        if (tank.move_turns === 0){
            tank.state = {name: "idle"};
        }
        
        if (tank.state.name === "move"){
            for (let cell of [tank.state.end_cell1, tank.state.end_cell2]){
                this.tasks.push({type: "cell", x: cell.x, y: cell.y});
            }
            
            for (let dx = 0; dx < 2; dx++){
                for (let dy = 0; dy < 2; dy++){
                    this.tasks.push({type: "cell", x: tank.state.start.x + dx, y: tank.state.start.y + dy});
                }
            }
            
            tank.move_turns--;
            
            const shift = this.tankShift.get(tank.direction);
            tank[shift[0]] += shift[5] * tank.speed;
        }
        
        if (tank.shoot_cooldown !== 0){
            tank.shoot_cooldown--;
        }
    }
  
    step(){
        for (let bullet of this.bullets){
            this.moveBullet(bullet);
        }   
        this.bullets = this.bullets.filter(bullet => bullet.to_delete !== true);
    
        for (let tank of this.tanks){
            this.moveTank(tank);
        }
        
        let n_td_effects = [];
        for (let td_effect of this.td_effects){
            td_effect.next_turn();
            if (td_effect.to_delete === true){
                for (let j = 0; j < 3; j++){
                        for (let k = 0; k < 3; k++){
                            this.tasks.push({type: "cell", x: Math.floor(td_effect.x) + j, y: Math.floor(td_effect.y) + k});
                        }
                    }
            }
            else{
                n_td_effects.push(td_effect);
            }
        }
        this.td_effects = n_td_effects;
        
        for (let bullet of this.bullets){
            let flags = Collider.objIntersects(bullet, this.tanks);
            for (let i = 0; i < this.tanks.length; i++){
                if (flags[i]){
                    bullet.onVictim(this.tanks[i]);
                    for (let j = 0; j < 3; j++){
                        for (let k = 0; k < 3; k++){
                            this.tasks.push({type: "cell", x: Math.floor(this.tanks[i].x) + j, y: Math.floor(this.tanks[i].y) + k});
                        }
                    }
                }
            }
            
            let n_tanks = [];
            for (let tank of this.tanks){
                if (tank.to_delete === true){
                    this.td_effects.push(new TankDeathEffect(tank.x, tank.y, tank.size));
                }
                else{
                    n_tanks.push(tank);
                }
            }
            this.tanks = n_tanks;
            this.bullets = this.bullets.filter(bullet => bullet.to_delete !== true);
        }
    }
    
    draw(){
        this.step();
        
        for (let td_effect of this.td_effects){
            this.tasks.push({type: "td_effect", td_effect});
        }
        
        for (let tank of this.tanks) {
            this.tasks.push({type: "tank", tank});
        }
    
        for (let bullet of this.bullets) {
            this.tasks.push({type: "bullet", bullet});
        }
        
        for (let ai of this.ais) {
            ai.turn();
        }
    
        this.renderer.render();
        this.turn_++;
    }
}


class UI{
    static keyHandler(e){
        let text = e.code + '\n';
        if (e.code === "Space"){
        //puff!
        }
        switch (e.code){
          case "ArrowUp":
          case "ArrowLeft":
          case "ArrowDown":
          case "ArrowRight":
            field.callTankMove(user_tank, Direction[e.code.substring(5)]);
            break;
          case "Space":
            field.callTankShoot(user_tank);
            break;
        }
    }
}

function throttle(func, limit){
    return func; //TODO
}

addEventListener("keydown", throttle(UI.keyHandler, 50));
let field = new Field();
let renderer = new Renderer(field);
field.renderer = renderer;
const textures = new Image();
textures.src = "textures.png";
let user_tank = new Tank(0, 0, 0, Math.floor(Math.random() * 8));
field.addTank(user_tank);
let enemy_tank = new Tank(field.width - 2, field.height - 2, 0, Math.floor(Math.random() * 8) + 8);
field.addTank(enemy_tank);
let ai = new Private(field, enemy_tank);
field.addAI(ai);
setInterval(() => field.draw(), 1000/field.fps);
