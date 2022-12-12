class PIXI_ConsumableDrawer extends Drawer{
    draw(graphics, scale, data){
        let {cons} = data;
        graphics.beginFill(0x00ffff);
        graphics.drawRect(cons.x * scale, cons.y * scale, scale * cons.size, scale * cons.size);
        graphics.endFill();
    }
}