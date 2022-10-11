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
    draw(context, scale, data){
        let {tank} = data;
        context.drawImage(textures, VechileDrawer.texture_x(tank.texture, tank.direction, tank.move_turns),  
                               VechileDrawer.texture_y(tank.texture), 16, 16, 
		                       tank.x * scale, tank.y * scale, 
                               scale * tank.size, scale * tank.size);
    }
}