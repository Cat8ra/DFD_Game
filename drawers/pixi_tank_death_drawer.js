class PIXI_EffectDrawer extends Drawer{
    draw(graphics, scale, data){
        let {effect} = data;
        effect.sprite.anchor.set(0.5);
        effect.sprite.x = effect.x * scale;
        effect.sprite.y = effect.y * scale;
        effect.next_turn();
    }
}