class PIXI_TerrainDrawer extends Drawer{
    draw(graphics, scale, data){
        let {width, height, cell, i, j} = data;
        if (i < 0 || i >= width || j < 0 || j >= height){
			return;
		}
		const textureCoords = new Map([
          [Cell.Empty, [384, 240, 8, 8]],
		  [Cell.Brick, [256,  64, 8, 8]],
		  [Cell.Wall,  [256,  72, 8, 8]],
		  [Cell.Grass, [264,  72, 8, 8]],
          [Cell.Water, [256,  80, 8, 8]],
		]);
        const colors = {
            /*Cell.Empty*/ 0: 0x000000,
            /*Cell.Brick*/ 1: 0xCC7700,
            /*Cell.Wall */ 2: 0x777777,
            /*Cell.Grass*/ 3: 0x007700,
            /*Cell.Water*/ 4: 0x0000AA
        };
        let color = colors[cell];
        graphics.beginFill(color);
        graphics.drawRect(j * scale, i * scale, scale, scale);
        graphics.endFill();
    }
}