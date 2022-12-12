class PIXI_VechileDrawer extends Drawer{
    draw(graphics, scale, data){
        let {tank} = data;
        
        const colors = {
            0: 0x777700,
            1: 0x000077,
            2: 0xDDDDDD,
            3: 0x770000
        };
        let color = colors[Math.floor(tank.texture / 8)];
        graphics.beginFill(color);
        let r = scale * tank.size / 2;
        let cx = tank.x * scale + r;
        let cy = tank.y * scale + r;
        graphics.drawCircle(cx, cy, r);
        graphics.endFill();
    }
}