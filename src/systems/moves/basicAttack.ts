import { BattleEntity } from "../../entities/BattleEntity";
import helpers from "../../helpers";

export default (scene: Phaser.Scene, entityA: BattleEntity, entityB: BattleEntity, onComplete: Function) => {
    const ogx = entityA.ax;
    const ogy = entityA.ay;

    const left = entityA.ax < entityB.ax;
    const up = entityA.ay < entityB.ay;

    scene.tweens.add({
        targets: entityA,
        aangle: left ? -40 : 40,
        duration: 400,
        ay: ogy + (up ? -20 : 20),
        ax: ogx + (left ? -20 : 20),
        ease: "Power2.easeOut",
        onComplete: () => {
            setTimeout(() => {
                entityB.hit();
                helpers.dmgNumbers(scene, entityB.ax, entityB.ay, 10);
                entityB.stats.damage(10);
            }, 200);
            scene.tweens.add({
                targets: entityA,
                ax: entityB.ax,
                ay: entityB.ay,
                aangle: left ? 20 : -20,
                duration: 500,
                ease: "Bounce.easeOut",
                onComplete: () => {
                    scene.tweens.add({
                        targets: entityA,
                        ax: ogx,
                        ay: ogy,
                        aangle: 0,
                        duration: 500,
                        ease: "Power2.easeOut",
                        onComplete: () => {
                            entityA.stats.ap = 0;
                            onComplete();
                        }
                    });
                }
            });
        }
    });
};