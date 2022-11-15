class ConsumableDrawer extends Drawer{
    static texture_x(texture) {
        return 256 + 16 * texture;
    }
    static texture_y(texture) {
        return 112;
    }
    draw(context, scale, data){
        let {cons} = data;
        context.drawImage(textures, ConsumableDrawer.texture_x(cons.texture),  
                               ConsumableDrawer.texture_y(cons.texture), 16, 16, 
		                       cons.x * scale, cons.y * scale, 
                               scale * cons.size, scale * cons.size);
    }
}