export default {
    lerp: (value1: number, value2: number, amount: number) => {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    },
    dist: (g1: any, g2: any): number => {
        return Math.sqrt(Math.pow(g1.y - g2.y, 2) + Math.pow(g1.x - g2.x, 2));
    },
    clamp: (min: number, max: number, v: number): number => {
        return Math.min(Math.max(v, min), v);
    },
    dmgNumbers(scene: Phaser.Scene, x: number, y: number, amount: number) {
        const randx = (Math.random()*20) - 20;

        const spr = scene.add.sprite(x + randx, y, "hit");
        spr.depth = 3500;
        spr.anims.play("hit1_anim");
        const rands = 1 + Math.random()*0.5;
        spr.setScale(rands, rands);
        spr.angle = Math.random()*360;

        const txt = scene.add.text(x + randx, y, amount.toString(), {
            fontFamily: "ARCADECLASSIC",
            fontSize: 26,
            color: "#FFFFFF",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        });
        txt.depth = 4000;
        txt.setScale(0, 0);
        txt.originX = 0.5;
        txt.originY = 0.5;
        scene.tweens.add({
            targets: txt,
            ease: "Bounce.easeOut",
            duration: 900,
            scaleX: 1,
            scaleY: 1,
            y: y - 50,
        });
        scene.tweens.add({
            targets: txt,
            ease: "Power2.easeOut",
            alpha: 0,
            duration: 1600,
            delay: 500,
            onComplete: () => {
                txt.destroy();
                spr.destroy();
            }
        });
    }
}