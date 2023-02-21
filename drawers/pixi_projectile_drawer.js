class PIXI_ProjectileDrawer extends Drawer{
    draw(graphics, scale, data){
        let {bullet} = data;
        const dsx = [0, 1, 1, 0];
        const dsy = [0, 0, 1, 1];

        let cx = (bullet.x + dsx[bullet.direction] * bullet.size) * scale;
        let cy = (bullet.y + dsy[bullet.direction] * bullet.size) * scale;

        bullet.sprite.x = cx;
        bullet.sprite.y = cy;
        bullet.sprite.rotation = Math.PI / 180 * 90 * (bullet.direction);
        bullet.sprite.alpha = 1;
    }
}