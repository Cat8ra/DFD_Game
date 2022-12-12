class PIXI_TankDeathDrawer extends Drawer{
    draw(graphics, scale, data){
        let {td_effect} = data;
        graphics.lineStyle(2, 0xFFFFFF, 1);
        let r = scale * Tank.SIZE * ((td_effect.phase + 1) / 3) / 2 / 2;
        let cx = td_effect.x * scale + scale * Tank.SIZE / 2;
        let cy = td_effect.y * scale + scale * Tank.SIZE / 2;
        graphics.drawCircle(cx, cy, r);
        graphics.lineStyle(0, 0xFFFFFF, 1);
    }
}