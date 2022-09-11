"use strict";
const Direction = { Up: 0, Right: 1, Down: 2, Left: 3};
const Cell = { Empty: 0, Brick: 1, Wall: 2, Grass: 3 };
let pressed_arrow = null;
let tanks_list = [];

class Tank{
  constructor(pos_x = 0, pos_y = 0, dir = Direction.Up, texture = 0){
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.id = Tank.new_id;
    this.direction = dir;
    this.texture = texture;
	this.stat = {name : "idle"};
    this.move_frames = 0;
    tanks_list.push(this);
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

    if (tanks_list[0].move_frames === 0 && pressed_arrow !== null) {
      tanks_list[0].direction = pressed_arrow;
      const [pos, x1, x2, y1, y2, mult, edge] = tankShift.get(pressed_arrow);

      if (tanks_list[0][pos] !== edge &&
        this.grid[tanks_list[0].pos_y + y1][tanks_list[0].pos_x + x1] == Cell.Empty &&
        this.grid[tanks_list[0].pos_y + y2][tanks_list[0].pos_x + x2] == Cell.Empty){
        tanks_list[0].move_frames = 8;
		tanks_list[0].stat = { name: "move", 
		              start: { x: tanks_list[0].pos_x, y: tanks_list[0].pos_y},
					  end_cell1: {x: tanks_list[0].pos_x + x1, y: tanks_list[0].pos_y + y1},
					  end_cell2: {x: tanks_list[0].pos_x + x2, y: tanks_list[0].pos_y + y2},
					};
      }
    }
    
	if (tanks_list[0].move_frames === 0){
		tanks_list[0].stat = {name: "idle"};
	}
    if (tanks_list[0].stat.name === "move"){
		 console.log(tanks_list[0].stat);
	  for (let cell of [tanks_list[0].stat.end_cell1, tanks_list[0].stat.end_cell2]){
		this.tasks.push({type: "cell", x: cell.x, y: cell.y});
	  }
	  for (let dx = 0; dx < 2; dx++){
		  for (let dy = 0; dy < 2; dy++){
			  this.tasks.push({type: "cell", x: tanks_list[0].stat.start.x + dx, y: tanks_list[0].stat.start.y + dy});
		  }
	  }
      tanks_list[0].move_frames--;
      console.log(tanks_list[0].move_frames);

      const shift = tankShift.get(tanks_list[0].direction);

      tanks_list[0][shift[0]] += shift[5] * (2/16);
    }
    //move tank
    pressed_arrow = null;
  }
  draw(){
    this.step();

    
    for (let tank of this.tanks) {
        this.tasks.push({type: "tank", tank});
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