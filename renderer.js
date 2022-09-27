class Drawer{
    static draw(){}
}
class TerrainDrawer extends Drawer{
    static draw(context, scale, width, height, cell, i, j){
        if (i < 0 || i >= width || j < 0 || j >= height){
			return;
		}
		const textureCoords = new Map([
          [Cell.Empty, [384, 240, 8, 8]],
		  [Cell.Brick, [256,  64, 8, 8]],
		  [Cell.Wall,  [264,  64, 8, 8]],
		  [Cell.Grass, [264,  72, 8, 8]],
		]);
		const [sx, sy, w, h] = textureCoords.get(cell);
		context.drawImage(textures, sx, sy, w, h, j * scale, i * scale, scale, scale);
    }
}
/*class ObstacleDrawer extends Drawer{
    static draw(){
        
    }
}*/
class ProjectileDrawer extends Drawer{
    static draw(context, scale, bullet){
        context.drawImage(textures, bullet.texture_x,  bullet.texture_y, 4, 4, 
		                       bullet.x * scale, bullet.y * scale, 
                               scale * bullet.size, scale * bullet.size);
    }
}
class VechileDrawer extends Drawer{
    static texture_x(texture, direction, move_turns) {
        let x = 0;
        if (texture > 15)
        x += 128;
        switch (direction){
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
        if (move_turns % 2 === 1){
            x += 16;
        }
        return x;
    }
    static texture_y(texture) {
        return (texture % 16) * 16;
    }
    static draw(context, scale, tank){
        context.drawImage(textures, VechileDrawer.texture_x(tank.texture, tank.direction, tank.move_turns),  
                               VechileDrawer.texture_y(tank.texture), 16, 16, 
		                       tank.x * scale, tank.y * scale, 
                               scale * tank.size, scale * tank.size);
    }
}
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
                        if (i < 0 || i >= this.field.width || j < 0 || j >= this.field.height){
                            continue;
                        }
					    TerrainDrawer.draw(this.context, this.scale, this.width, this.height, this.field.grid[i][j], i, j);
					}
				}
				break;
			case "cell":
                if (task.y < 0 || task.y >= this.field.width || task.x < 0 || task.x >= this.field.height){
                    break;
                }
			    TerrainDrawer.draw(this.context, this.scale, this.width, this.height, 
                                   this.field.grid[task.y][task.x], task.y, task.x);
				break;
			case "tank":
				VechileDrawer.draw(this.context, this.scale, task.tank);
				break;
			case "bullet":
				ProjectileDrawer.draw(this.context, this.scale, task.bullet);
				break;
		}
	}
}