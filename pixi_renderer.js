class PIXI_Renderer{
	constructor(field, scale = 16){
		this.field = field;
		this.scale = scale;
        this.context = new PIXI.Graphics();
        app.stage.addChild(this.context);
        
		this.width = this.field.width;
		this.height = this.field.height;
        
        this.drawers = { terrain: new PIXI_TerrainDrawer(),
                         vechile: new PIXI_VechileDrawer(),
                         projectile: new PIXI_ProjectileDrawer(),
                         td_effect: new PIXI_TankDeathDrawer(),
                         cons: new PIXI_ConsumableDrawer()
                       };
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
                try{
			    this.drawers.terrain.draw(this.context, this.scale, 
                            { width: this.width, 
                              height: this.height, 
                              cell: this.field.grid[task.y][task.x], 
                              i: task.y, 
                              j: task.x
                            });
                }
                catch (e){console.log(e, task);}
				break;
			case "tank":
				this.drawers.vechile.draw(this.context, this.scale, {tank: task.tank});
				break;
			case "bullet":
                this.drawers.projectile.draw(this.context, this.scale, {bullet: task.bullet});
				break;
            case "cons":
                this.drawers.cons.draw(this.context, this.scale, {cons: task.cons});
				break;
            case "td_effect":
                this.drawers.td_effect.draw(this.context, this.scale, {td_effect: task.td_effect});
				break;
		}
	}
}