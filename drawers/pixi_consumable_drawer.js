class PIXI_ConsumableDrawer extends Drawer{
    draw(graphics, scale, data){
        let {cons} = data;

        cons.sprite.x = cons.x * scale;
        cons.sprite.y = cons.y * scale;

        cons.sprite.scale.x = 2;
        cons.sprite.scale.y = 2;
    }
}