class TankDeathDrawer extends Drawer{
    draw(context, scale, data){
        let {td_effect} = data;
        context.drawImage(textures, TankDeathDrawer.texture_x(td_effect),  TankDeathDrawer.texture_y(td_effect), 16, 16, 
		                       td_effect.x * scale, td_effect.y * scale, 
                               scale * td_effect.size, scale * td_effect.size);
    }
    
    static texture_x(td_effect){
        return 256 + 16 * td_effect.phase;
    }
    static texture_y(td_effect){
        return 128;
    }
}