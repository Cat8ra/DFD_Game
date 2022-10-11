class ProjectileDrawer extends Drawer{
    draw(context, scale, data){
        let {bullet} = data;
        context.drawImage(textures, bullet.texture_x,  bullet.texture_y, 4, 4, 
		                       bullet.x * scale, bullet.y * scale, 
                               scale * bullet.size, scale * bullet.size);
    }
}