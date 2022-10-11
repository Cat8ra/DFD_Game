class Renderer{
	constructor(field, scale = 16){
		this.field = field;
		this.canvas = document.getElementById("field");
		this.context = this.canvas.getContext("2d");
		this.scale = scale;
		this.width = this.field.width;
		this.height = this.field.height;
        
        this.drawers = { terrain: new TerrainDrawer(),
                         vechile: new VechileDrawer(),
                         projectile: new ProjectileDrawer()
                       }
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
					    this.drawers.terrain.draw(this.context, this.scale, 
                            { width: this.width, 
                              height: this.height, 
                              cell: this.field.grid[i][j], 
                              i: i, 
                              j: j
                            });
					}
				}
				break;
			case "cell":
                if (task.y < 0 || task.y >= this.field.width || task.x < 0 || task.x >= this.field.height){
                    break;
                }
			    this.drawers.terrain.draw(this.context, this.scale, 
                            { width: this.width, 
                              height: this.height, 
                              cell: this.field.grid[task.y][task.x], 
                              i: task.y, 
                              j: task.x
                            });
				break;
			case "tank":
				this.drawers.vechile.draw(this.context, this.scale, {tank: task.tank});
				break;
			case "bullet":
        this.drawers.projectile.draw(this.context, this.scale, {bullet: task.bullet});
				break;
		}
	}
}