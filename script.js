"use strict";
const Direction = { Up: 0, Right: 1, Down: 2, Left: 3};
const Cell = { Empty: 0, Brick: 1, Wall: 2, Grass: 3 };
let pressed_arrow = null;

class Tank{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0){
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.id = Tank.new_id;
    this.direction = dir;
    this.texture = texture;
	this.stat = {name : "idle"};
    this.move_frames = 0;
  }

  get texture_x() {
    let x = 0;
    if (this.texture > 15)
      x += 128;
    switch (this.direction){
      case Direction.Right:
        x += 96;
        break;
      case Direction.Down:
        x += 64;
        break;
      case Direction.Left:
        x += 32;
        break;
    }
    if (this.move_frames % 2 === 1)
      x += 16;
    return x;
  }
  get texture_y() {
    return (this.texture % 16) * 16;
  }

  static next_id = 0;
  static get new_id() { return Tank.next_id++; }

}

class Field{
  constructor(width = 50, height = 50, scale = 16){
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.grid = new Array(height);
    for (let i = 0; i < height; i++){
      this.grid[i] = new Array(width);
    }
    for (let i = 0; i < height; i++){
      for (let j = 0; j < width; j++){
        this.grid[i][j] = Cell.Empty;
      }
    }
    this.canvas = document.getElementById("field");
    this.context = this.canvas.getContext("2d");
    this.tanks = [];
	this.bullets = [];
	this.tasks = [{type: "field"}];
    this.frame_ = 0;
    this.fps = 16;
  }
  addTank(tank){
    this.tanks.push(tank);
  }
  step(){
    if (pressed_arrow !== null) {
      console.log(pressed_arrow);
    }

    const tankShift = new Map([
      [Direction.Up,    ['pos_y',  0,  1, -1, -1, -1, 0]],
      [Direction.Down,  ['pos_y',  0,  1,  1,  1,  1, this.height - 2]],
      [Direction.Left,  ['pos_x', -1, -1,  0,  1, -1, 0]],
      [Direction.Right, ['pos_x',  1,  1,  0,  1,  1, this.width - 2]],
    ]);
    
	if (user_tank.shoot) {
        const [pos, x1, x2, y1, y2, mult, edge] = tankShift.get(user_tank.direction);
		user_tank.shoot = false;
		this.bullets.push({direction: user_tank.direction, 
		                   x: user_tank.pos_x + 1 + (x1) - 4/16, 
						   y: user_tank.pos_y + 1 + (y1) - 4 / 16,
						   texture_x: 322 + 8 * (user_tank.direction % 2 === 0 ? user_tank.direction : 4 - user_tank.direction),
						   texture_y: 102});
	}
	
	for (let bullet of this.bullets){
		const bulletShift = new Map([
		  [Direction.Up,    [ 0, -1]],
		  [Direction.Down,  [ 0,  1]],
          [Direction.Left,  [-1,  0]],
          [Direction.Right, [ 1,  0]],
		]);
		const [dx, dy] = bulletShift.get(bullet.direction);
		let x0 = Math.floor(bullet.x);
		let y0 = Math.floor(bullet.y);
		for (let i = 0; i < 2; i++){
			for (let j = 0; j < 2; j++){
				this.tasks.push({type: "cell", x: x0 + i, y: y0 + j});
			}
		}
		bullet.x += dx * 3 / 16;
		bullet.y += dy * 3 / 16;
	}
	
    if (user_tank.move_frames === 0 && pressed_arrow !== null) {
      user_tank.direction = pressed_arrow;
      const [pos, x1, x2, y1, y2, mult, edge] = tankShift.get(pressed_arrow);

      if (user_tank[pos] !== edge &&
        this.grid[user_tank.pos_y + y1][user_tank.pos_x + x1] == Cell.Empty &&
        this.grid[user_tank.pos_y + y2][user_tank.pos_x + x2] == Cell.Empty){
        user_tank.move_frames = 8;
		user_tank.stat = { name: "move", 
		              start: { x: user_tank.pos_x, y: user_tank.pos_y},
					  end_cell1: {x: user_tank.pos_x + x1, y: user_tank.pos_y + y1},
					  end_cell2: {x: user_tank.pos_x + x2, y: user_tank.pos_y + y2},
					};
      }
    }
    
	if (user_tank.move_frames === 0){
		user_tank.stat = {name: "idle"};
	}
    if (user_tank.stat.name === "move"){
		 console.log(user_tank.stat);
	  for (let cell of [user_tank.stat.end_cell1, user_tank.stat.end_cell2]){
		this.tasks.push({type: "cell", x: cell.x, y: cell.y});
	  }
	  for (let dx = 0; dx < 2; dx++){
		  for (let dy = 0; dy < 2; dy++){
			  this.tasks.push({type: "cell", x: user_tank.stat.start.x + dx, y: user_tank.stat.start.y + dy});
		  }
	  }
      user_tank.move_frames--;
      console.log(user_tank.move_frames);

      const shift = tankShift.get(user_tank.direction);

      user_tank[shift[0]] += shift[5] * (2/16);
    }
    //move tank
    pressed_arrow = null;
  }
  draw(){
    this.step();

    
    for (let tank of this.tanks) {
        this.tasks.push({type: "tank", tank});
    }
	
	for (let bullet of this.bullets) {
        this.tasks.push({type: "bullet", bullet});
    }
	
	this.renderer.render();
    this.frame_++;
  }

}

class Renderer{
	constructor(field){
		this.field = field;
		this.canvas = document.getElementById("field");
		this.context = this.canvas.getContext("2d");
	}
	render(){
		while (field.tasks.length !== 0){
			let task = field.tasks.shift();
		    this.solve(task);	
		}
	}
	solve(task){
		switch (task.type){
			case "field":
				for (let i = 0; i < this.field.height; i++){
					for (let j = 0; j < this.field.width; j++){
					    this.draw_cell(i, j);
					}
				}
				break;
			case "cell":
			    this.draw_cell(task.y, task.x);
				break;
			case "tank":
				this.draw_tank(task.tank);
				break;
			case "bullet":
				this.draw_bullet(task.bullet);
				break;
		}
	}
	draw_cell(i, j){
		const textureCoords = new Map([
          [Cell.Empty, [384, 240, 8, 8]],
		  [Cell.Brick, [256,  64, 8, 8]],
		  [Cell.Wall,  [264,  64, 8, 8]],
		  [Cell.Grass, [264,  72, 8, 8]],
		]);
		const [sx, sy, w, h] = textureCoords.get(this.field.grid[i][j]);
		console.log(sx, sy, w, h);
		this.context.drawImage(textures, sx, sy, w, h, j * this.field.scale, i * this.field.scale, this.field.scale, this.field.scale);
	}
	draw_tank(tank){
		this.context.drawImage(textures, tank.texture_x,  tank.texture_y, 16, 16, 
		                       tank.pos_x * this.field.scale, tank.pos_y * this.field.scale, this.field.scale * 2, this.field.scale * 2);
	}
	draw_bullet(bullet){
		console.log("!", textures, bullet.texture_x,  bullet.texture_y, 4, 4, 
		                       bullet.x * this.field.scale, bullet.y * this.field.scale, this.field.scale / 2, this.field.scale / 2);
		this.context.drawImage(textures, bullet.texture_x,  bullet.texture_y, 4, 4, 
		                       bullet.x * this.field.scale, bullet.y * this.field.scale, this.field.scale / 2, this.field.scale / 2);
	}
}

function keyHandler(e){
  let text = e.code + '\n';
  if (e.code === "Space"){
    //puff!
  }
  switch (e.code){
    case "ArrowUp":
      pressed_arrow = Direction.Up;
      break;
    case "ArrowLeft":
      pressed_arrow = Direction.Left;
      break;
    case "ArrowDown":
      pressed_arrow = Direction.Down;
      break;
    case "ArrowRight":
      pressed_arrow = Direction.Right;
      break;
	case "Space":
	  user_tank.shoot = true;
	  break;
  }
}

addEventListener("keydown", keyHandler);
let field = new Field();
let renderer = new Renderer(field);
field.renderer = renderer;
const textures = new Image();
textures.src = "textures.png";
let user_tank = new Tank(0, 0, 0, Math.floor(Math.random() * 8));
field.addTank(user_tank);
setInterval(() => field.draw(), 1000/field.fps);