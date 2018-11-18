import { BattleEntity, BattleStats } from "./BattleEntity";
import basicAttack from "../systems/moves/basicAttack";

export interface EnemyInfo {
    key: string;
}

export class Enemy extends Phaser.GameObjects.Sprite implements BattleEntity {
    casting(): void {
    }
    reset(): void {
    }
    get aangle(): number { return this.angle; }
    set aangle(v: number) { this.angle = v; }
    get ax(): number { return this.x; }
    set ax(v: number) { this.x = v; }
    get ay(): number { return this.y; }
    set ay(v: number) { this.y = v; }
    isFriendly: boolean = false;
    formationXOffset: number;
    formationYOffset: number;
    stats: BattleStats = new BattleStats();
    dead: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, public info: EnemyInfo) {
        super(scene, x, y, info.key)
        this.scene = scene;
        scene.add.existing(this);
        this.stats.hp = 5;
        this.depth = 50;
        this.anims.play(info.key + "_idle");
        this.stats.apRate = 0.01;
    }

    preUpdate(t: number, delta: number) {
        super.preUpdate(t, delta);
    }

    hit(): void {
        this.scene.cameras.main.shake(250, 0.01);
        const ogx = this.ax;
        this.scene.tweens.add({
            targets: this,
            duration: 70,
            ax: ogx - 5,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    duration: 70,
                    ax: ogx + 5,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: this,
                            duration: 40,
                            ax: ogx,
                        });
                    }
                });
            }
        });
    }

    aiPlayTurn(groupB: BattleEntity[], cb: Function) {
        basicAttack(this.scene, this, groupB[0], () => {
            cb();
        });
    }

    die() {
        if (this.dead) return;
        this.dead = true;

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            ease: "Power2.easeInOut"
        });
    }
}