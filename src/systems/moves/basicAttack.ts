import { BattleEntity } from "../../entities/BattleEntity";

export default (scene: Phaser.Scene, entityA: BattleEntity, entityB: BattleEntity, onComplete: Function) => {
    const ogx = entityA.ax;
    const ogy = entityA.ay;

    scene.tweens.add({
        targets: entityA,
        ax: entityB.ax,
        ay: entityB.ay,
        duration: 500,
        ease: "Power2.easeOut",
        onComplete: () => {
            scene.tweens.add({
                targets: entityA,
                ax: ogx,
                ay: ogy,
                duration: 500,
                ease: "Power2.easeOut",
                onComplete: () => {
                    entityA.stats.ap = 0;
                    onComplete();
                }
            });
        }
    });
};