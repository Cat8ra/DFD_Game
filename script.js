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
		this.frame_ = 0;
		this.fps = 16;
	}
	addTank(tank){
		this.tanks.push(tank);
	}
	step(){
		if (pressed_arrow !== null)
			console.log(pressed_arrow);
		if (tanks_list[0].move_frames === 0 && pressed_arrow !== null){
			tanks_list[0].direction = pressed_arrow;
			switch (pressed_arrow){
				case Direction.Up:
					if (tanks_list[0].pos_y !== 0 && 
					    this.grid[tanks_list[0].pos_y - 1][tanks_list[0].pos_x] == Cell.Empty && 
						this.grid[tanks_list[0].pos_y - 1][tanks_list[0].pos_x + 1] == Cell.Empty){
						tanks_list[0].move_frames = 8;
					}
					break;
				case Direction.Down:
					if (tanks_list[0].pos_y !== this.height - 2 && 
					    this.grid[tanks_list[0].pos_y + 1][tanks_list[0].pos_x] == Cell.Empty && 
						this.grid[tanks_list[0].pos_y + 1][tanks_list[0].pos_x + 1] == Cell.Empty){
						tanks_list[0].move_frames = 8;
					}
					break;
				case Direction.Left:
					if (tanks_list[0].pos_x !== 0 && 
					    this.grid[tanks_list[0].pos_y][tanks_list[0].pos_x - 1] == Cell.Empty && 
						this.grid[tanks_list[0].pos_y + 1][tanks_list[0].pos_x - 1] == Cell.Empty){
						tanks_list[0].move_frames = 8;
					}
					break;
				case Direction.Right:
					if (tanks_list[0].pos_x !== this.width - 2 && 
					    this.grid[tanks_list[0].pos_y][tanks_list[0].pos_x + 1] == Cell.Empty && 
						this.grid[tanks_list[0].pos_y + 1][tanks_list[0].pos_x + 1] == Cell.Empty){
						tanks_list[0].move_frames = 8;
					}
					break;
		    }
		}
		if (tanks_list[0].move_frames !== 0){
			tanks_list[0].move_frames--;
			console.log(tanks_list[0].move_frames);
			switch (tanks_list[0].direction){
				case Direction.Up:
				    tanks_list[0].pos_y -= 2/16;
					break;
				case Direction.Down:
				    tanks_list[0].pos_y += 2/16;
					break;
				case Direction.Left:
				    tanks_list[0].pos_x -= 2/16;
					break;
				case Direction.Right:
				    tanks_list[0].pos_x += 2/16;
					break;
			}
		}
		//move tank
		pressed_arrow = null;
	}
	draw(){
		this.step();
		
		for (let i = 0; i < this.height; i++){
			for (let j = 0; j < this.width; j++){
				switch (this.grid[i][j]){
					case Cell.Empty:
					    this.context.drawImage(textures, 384, 240, 8, 8, j * this.scale, i * this.scale, this.scale, this.scale);
						break;
					case Cell.Brick:
					    this.context.drawImage(textures, 256,  64, 8, 8, j * this.scale, i * this.scale, this.scale, this.scale);
						break;
					case Cell.Wall:
					    this.context.drawImage(textures, 264,  64, 8, 8, j * this.scale, i * this.scale, this.scale, this.scale);
						break;
					case Cell.Grass:
					    this.context.drawImage(textures, 264,  72, 8, 8, j * this.scale, i * this.scale, this.scale, this.scale);
						break;
				}
			}
		}
		for (let tank of this.tanks){
			this.context.drawImage(textures, tank.texture_x,  tank.texture_y, 16, 16, tank.pos_x * this.scale, tank.pos_y * this.scale, this.scale * 2, this.scale * 2);
						
		}
		this.frame_++;
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
const textures = new Image();
textures.src = "textures.png";
let user_tank = new Tank(0, 0, 0, Math.floor(Math.random() * 8));
field.addTank(user_tank);
setInterval(() => field.draw(), 1000/field.fps);