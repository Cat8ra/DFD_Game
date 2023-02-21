class PIXI_TerrainDrawer extends Drawer{
    draw(graphics, scale, data){
        let {width, height, cell, i, j} = data;

        const sprite = field.sprites[i][j];
        sprite.x = j * scale;
        sprite.y = i * scale;

        sprite.scale.x = sprite.scale.y = 2;

    }
}