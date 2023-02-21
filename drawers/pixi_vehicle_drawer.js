class PIXI_VehicleDrawer extends Drawer{
    draw(graphics, scale, data){
        let {tank} = data;

        const dsx = [0, 1, 1, 0];
        const dsy = [0, 0, 1, 1];

        let cx = (tank.x + dsx[tank.direction] * Tank.SIZE) * scale;
        let cy = (tank.y + dsy[tank.direction] * Tank.SIZE) * scale;

        tank.sprites[tank.texture].x = cx;
        tank.sprites[tank.texture].y = cy;
        tank.sprites[tank.texture].rotation = Math.PI / 180 * 90 * (tank.direction);

    }
}