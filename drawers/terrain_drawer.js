class TerrainDrawer extends Drawer{
    draw(context, scale, data){
        let {width, height, cell, i, j} = data;
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