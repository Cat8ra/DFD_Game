class PIXI_ProjectileDrawer extends Drawer{
    draw(graphics, scale, data){
        let {bullet} = data;
        graphics.beginFill(0x770077);
        graphics.drawRect(bullet.x * scale, bullet.y * scale, scale * bullet.size, scale * bullet.size);
        graphics.endFill();
    }
}