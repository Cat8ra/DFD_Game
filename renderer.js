class Renderer{
	constructor(field, scale = 16){
		this.field = field;
		this.canvas = document.getElementById("field");
		this.context = this.canvas.getContext("2d");
		this.scale = scale;
		this.width = this.field.width;
		this.height = this.field.height;
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
		if (i < 0 || i >= this.width || j < 0 || j >= this.height){
			return;
		}
		const textureCoords = new Map([
          [Cell.Empty, [384, 240, 8, 8]],
		  [Cell.Brick, [256,  64, 8, 8]],
		  [Cell.Wall,  [264,  64, 8, 8]],
		  [Cell.Grass, [264,  72, 8, 8]],
		]);
		const [sx, sy, w, h] = textureCoords.get(this.field.grid[i][j]);
		console.log(sx, sy, w, h);
		this.context.drawImage(textures, sx, sy, w, h, j * this.scale, i * this.scale, this.scale, this.scale);
	}
	draw_tank(tank){
		this.context.drawImage(textures, tank.texture_x,  tank.texture_y, 16, 16, 
		                       tank.x * this.scale, tank.y * this.scale, this.scale * tank.size, this.scale * tank.size);
	}
	draw_bullet(bullet){
		this.context.drawImage(textures, bullet.texture_x,  bullet.texture_y, 4, 4, 
		                       bullet.x * this.scale, bullet.y * this.scale, this.scale * bullet.size, this.scale * bullet.size);
	}
}