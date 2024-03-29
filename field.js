
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
        this.tanks_pool = [];
        this.bullets = [];
        this.bullets_pool = [];
        this.effects = [];

        this.tasks = [{type: "field"}];
        this.ais = [];
        this.ai_pool = [];
        this.consumables = [];

        this.consGen = new CondConsumableGenerator();

        this.turn_ = 0;
        this.fps = 48;

        this.tankShift = new Map([
            [Direction.Up,    ['y',  0,  1, -1, -1, -1, 0, 0, -1, 1, -1]],
            [Direction.Down,  ['y',  0,  1,  1,  1,  1, this.height - 2, 0, Tank.SIZE, 1, Tank.SIZE]],
            [Direction.Left,  ['x', -1, -1,  0,  1, -1, 0, -1, 0, -1, 1]],
            [Direction.Right, ['x',  1,  1,  0,  1,  1, this.width - 2, Tank.SIZE, 0, Tank.SIZE, 1]],
        ]);

        this.bulletShift = new Map([
            [Direction.Up,    [ 0, -1]],
            [Direction.Down,  [ 0,  1]],
            [Direction.Left,  [-1,  0]],
            [Direction.Right, [ 1,  0]],
        ]);

        this.cellViscosity = new Map([
            [Cell.Empty, 8],
            [Cell.Grass, 8],
            [Cell.Brick, 8],
            [Cell.Wall, 8],

            [Cell.Water, 16],
        ]);
    }

    addTank(tank){
        if (tank !== undefined) {
            this.tanks.push(tank);
            tank.sprites[tank.texture].alpha = 1;
        }
    }

    addAI(ai){
        this.ais.push(ai);
    }

    callTankMove(tank, direction){
        if (tank.move_turns === 0) {

            tank.direction = direction;
            const [pos, x1, x2, y1, y2, mult, edge, ex1, ey1, ex2, ey2] = this.tankShift.get(direction);

            if (tank[pos] !== edge &&
                this.freeToMove(this.grid[tank.y + ey1][tank.x + ex1]) &&
                this.freeToMove(this.grid[tank.y + ey2][tank.x + ex2]) &&
                this.free(tank, tank.x + ex1, tank.y + ey1) &&
                this.free(tank, tank.x + ex2, tank.y + ey2)){

                tank.onStartMoving();
                if (tank === user_tank){
                    this.userTankMoveAudio.play();
                }

                tank.move_turns = this.getMoveTurns(tank, direction);
                tank.speed = this.getTankSpeed(tank, direction);
                //console.log(tank.move_turns);
                //console.log(tank.speed);
                tank.state = { name: "move",
                    start: { x: tank.x, y: tank.y },
                    end_cell1: { x: tank.x + ex1, y: tank.y + ey1 },
                    end_cell2: { x: tank.x + ex2, y: tank.y + ey2 },
                };
            }
            else{
                tank.onWrongMove();
            }
        }
    }

    free(t, x, y){
        for (let tank of this.tanks){
            if (tank === t){
                continue;
            }
            let add = Collider.cellsUnderObject(tank);
            for (let cell of add){
                if (cell.x == x && cell.y == y){
                    return false;
                }
            }
        }
        return true;
    }
    getMoveTurns(tank, direction){
        return this.cellViscosity.get(this.grid[Math.floor(tank.y)][Math.floor(tank.x)]);
    }
    getTankSpeed(tank, direction){
        return 1 / this.cellViscosity.get(this.grid[Math.floor(tank.y)][Math.floor(tank.x)]);
    }

    callTankShoot(tank){
        let flag = tank === this.user_tank ? tank.live_bullets === 0 : tank.shoot_cooldown === 0;
        if (flag){

            //console.log(tank.direction);
            const [pos, x1, x2, y1, y2, mult, edge, ex1, ey1, ex2, ey2] = this.tankShift.get(tank.direction);

            tank.shoot = false;
            tank.shoot_cooldown = tank.max_shoot_cooldown;

            for (let i = 0; i < tank.max_bullets; i++){
                this.addBullet(i * 5, new Bullet(tank.x + 1 + (x1 * 20/16) - 4 / 16,
                    tank.y + 1 + (y1 * 20/16) - 4 / 16,
                    tank.direction, tank.bullets_speed, tank));
            }
        }
    }

    addBullet(delay, bullet){
        this.bullets_pool.push( { delay, bullet } );
    }
    pushBullet(bullet){
        this.bullets.push(bullet);
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
            this.effects.push(new BulletDeathEffect(bullet.x - 1, bullet.y - 1, 2));
        }
        let cub = Collider.cellsUnderObject(bullet);
        for (let cell of cub){
            if (cell.y < 0 || cell.y >= this.width || cell.x < 0 || cell.x >= this.height){
                continue;
            }
            if (this.grid[cell.y][cell.x] == Cell.Wall){
                bullet.onWrongMove();
                this.effects.push(new BulletDeathEffect(bullet.x - 1, bullet.y - 1, 2));
                this.bulletWallAudio.play();
            }
        }

        bullet.state -= bullet.speed;
    }

    moveTank(tank){
        if (tank === undefined){
            return;
        }

        if (tank.move_turns === 0){
            tank.state = {name: "idle"};
            tank.x = Math.round(tank.x);
            tank.y = Math.round(tank.y);
            tank.onStopMoving();
            if (tank === user_tank){
                this.userTankMoveAudio.pause();
            }
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

    placeBullets(){
        let arr = [];
        for (let obj of this.bullets_pool){
            if (obj.delay > 0){
                obj.delay--;
                arr.push(obj);
            }
            else{
                this.pushBullet(obj.bullet);
            }
        }
        this.bullets_pool = arr;
    }

    step(){


        while (this.tanks.length < this.max_tanks && this.tanks_pool.length > 0){
            let item = document.getElementsByClassName("enemyItem")[0];
            if (item !== undefined) {
                item.remove();
            }
            let index = Math.round(Math.random() * this.tanks_pool.length);
            this.addTank(this.tanks_pool[index]);
            this.ais.push(this.ai_pool[index]);
            this.tanks_pool = this.tanks_pool.filter( (t, i) => i != index );
            this.ai_pool = this.ai_pool.filter( (a, i) => i != index );
        }

        if (this.consGen.callNext()){
            this.consumables.push(this.consGen.getNext());
        }

        this.placeBullets();

        for (let bullet of this.bullets){
            this.moveBullet(bullet);
        }
        this.bullets = this.bullets.filter(bullet => bullet.to_delete !== true);

        for (let tank of this.tanks){
            this.moveTank(tank);
        }

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

            let f2 = Collider.objIntersects(bullet, this.bullets);
            for (let i = 0; i < this.bullets.length; i++){
                if (f2[i] && this.bullets[i] !== bullet){
                    bullet.onBullet(this.bullets[i]);
                    for (let j = 0; j < 3; j++){
                        for (let k = 0; k < 3; k++){
                            this.tasks.push({type: "cell", x: Math.floor(this.bullets[i].x) + j, y: Math.floor(this.bullets[i].y) + k});
                        }
                    }
                }
            }

            this.tanks = this.tanks.filter(tank => tank !== undefined);

            let n_tanks = [];
            for (let tank of this.tanks){
                if (tank.to_delete === true){
                    //this.effects.push(new TankDeathEffect(tank.x, tank.y, tank.size));
                    if (tank !== user_tank) {
                        this.tankDeathAudio.play();
                    }
                    else{
                        this.userTankDeathAudio.play();
                    }
                }
                else{
                    n_tanks.push(tank);
                }
            }
            this.tanks = n_tanks;
            this.bullets = this.bullets.filter(bullet => bullet.to_delete !== true);

            let cells = Collider.cellsUnderObject(bullet);

            for (let cell of cells){
                if (this.grid[cell.y][cell.x] == Cell.Brick){
                    this.updateCell(cell.y, cell.x, Cell.Empty);
                    this.tasks.push({type: "field", x: cell.x, y: cell.y});
                    bullet.kill();
                    this.effects.push(new BulletDeathEffect(bullet.x - 1, bullet.y - 1, 2));
                    //console.log("!\\!");
                }
            }
            this.bullets = this.bullets.filter(bullet => bullet.to_delete !== true);
        }


        let cellsUnderUserTank = Collider.cellsUnderObject(user_tank);
        for (let cons of this.consumables){
            this.tasks.push({type: "cons", cons});
            if (Collider.objIntersects(user_tank, [cons])[0] === true){
                cons.onConsume(user_tank);
                this.consAudio.play();

                for (let j = 0; j < 3; j++){
                    for (let k = 0; k < 3; k++){
                        this.tasks.push({type: "cell", x: cons.x + j, y: cons.y + k});
                    }
                }
            }
        }
        this.consumables = this.consumables.filter(cons => cons.to_delete !== true);

        const uth = user_tank.hp;
        //end_status.textContent = "OK (" + uth + ")";

        //console.log(">>>" + uth);

        if (document.getElementsByClassName("lives")[0] !== undefined) {
            this.hp_view = document.getElementsByClassName("lives")[0].childNodes[3];
        }

        if (document.getElementsByClassName("level")[0] !== undefined) {
            this.lvl_view = document.getElementsByClassName("level")[0].childNodes[3];
        }

        if (this.hp_view !== undefined){
            this.hp_view.textContent = "" + uth;
        }
        if (this.lvl_view !== undefined){
            this.lvl_view.textContent = "" + user_tank.level;
        }

        if (this.tanks.length === 0){
            endOfGame(false);
        }
        if (this.tanks.length === 1){
            endOfGame(true);
        }
        if (this.tanks.find(tank => tank === user_tank) === undefined){
            endOfGame(false);
        }

        //pool_status.textContent = `Pool: ${this.tanks_pool.length} tanks`;
    }



    updateCell(x, y, type){
        terrainContainer.removeChild(this.sprites[x][y]);

        this.grid[x][y] = type;

        this.sprites[x][y] = PIXI.Sprite.from(spriteSheet.textures["terrain" + type]);
        terrainContainer.addChild(this.sprites[x][y]);
    }

    draw(){
        this.step();

        for (let effect of this.effects) {
            this.tasks.push({type: "effect", effect});
        }

        for (let tank of this.tanks) {
            this.tasks.push({type: "tank", tank});
        }

        for (let bullet of this.bullets) {
            this.tasks.push({type: "bullet", bullet});
        }

        for (let ai of this.ais) {
            if (ai !== undefined){
                ai.turn();
            }
        }

        this.renderer.render();
        this.turn_++;
    }

    loadMap(textMap){
        let index = 0;
        for (let ch in textMap){
            if (textMap[ch] !== "\n"){
                this.grid[(index - (index % this.width)) / this.width][index % this.width] = Number(textMap[ch]);
            }
            index++;
        }
    }

    freeToMove(cell_type){
        return cell_type !== Cell.Brick && cell_type !== Cell.Wall;
    }

    getPath(cellA, cellB){
        const INF = 1000000;
        let d = new Array();
        let u = new Array();
        let p = new Array();
        for (let i = 0; i < this.width; i++){
            d.push(new Array());
            u.push(new Array());
            p.push(new Array());
            for (let j = 0; j < this.height; j++){
                d[i].push(INF);
                u[i].push(false);
                p[i].push({x: -1, y: -1});
            }
        }
        d[cellA.x][cellA.y] = 0;
        for (let i = 0; i < this.width * this.height; i++){
            let v = {x: -1, y: -1};

            for (let x = 0; x < this.width; x++){
                for (let y = 0; y < this.height; y++){
                    if (!u[x][y] && ((v.x === v.y && v.y === -1) || d[x][y] < d[v.x][v.y])){
                        v = {x, y};
                    }
                }
            }

            if (d[v.x][v.y] === INF){
                break;
            }
            u[v.x][v.y] = true;

            if (v.x > 0 && this.freeToMove(this.grid[v.y][v.x - 1])){
                if (d[v.x][v.y] + 1 < d[v.x - 1][v.y]){
                    d[v.x - 1][v.y] = d[v.x][v.y] + 1;
                    p[v.x - 1][v.y] = v;
                }
            }
            if (v.x < this.width - 1 && this.freeToMove(this.grid[v.y][v.x + 1])){
                if (d[v.x][v.y] + 1 < d[v.x + 1][v.y]){
                    d[v.x + 1][v.y] = d[v.x][v.y] + 1;
                    p[v.x + 1][v.y] = v;
                }
            }
            if (v.y > 0 && this.freeToMove(this.grid[v.y - 1][v.x])){
                if (d[v.x][v.y] + 1 < d[v.x][v.y - 1]){
                    d[v.x][v.y - 1] = d[v.x][v.y] + 1;
                    p[v.x][v.y - 1] = v;
                }
            }
            if (v.y < this.height - 1 && this.freeToMove(this.grid[v.y + 1][v.x])){
                if (d[v.x][v.y] + 1 < d[v.x][v.y + 1]){
                    d[v.x][v.y + 1] = d[v.x][v.y] + 1;
                    p[v.x][v.y + 1] = v;
                }
            }
        }

        let path = new Array();
        if (d[cellB.x][cellB.y] !== INF){
            let cell = cellB;
            while (cellA.x !== cell.x || cellA.y !== cell.y){
                path.unshift(cell);
                cell = p[cell.x][cell.y];
            }
        }

        return path;
    }

    setSprites(){
        this.sprites = [];

        for (let i = 0; i < this.width; i++){
            this.sprites[i] = [];
            for (let j = 0; j < this.height; j++){
                this.sprites[i][j] = PIXI.Sprite.from(spriteSheet.textures["terrain" + this.grid[i][j]]);
                terrainContainer.addChild(this.sprites[i][j]);
            }
        }
    }
}