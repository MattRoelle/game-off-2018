import { BattleEntity, BattleStats } from "./BattleEntity";

export interface EnemyInfo {
    key: string;
}

export class Enemy extends Phaser.GameObjects.Sprite implements BattleEntity {
    get ax(): number { return this.x; }
    set ax(v: number) { this.x = v; }
    get ay(): number { return this.y; }
    set ay(v: number) { this.y = v; }
    formationXOffset: number;
    formationYOffset: number;
    stats: BattleStats = new BattleStats();

    constructor(scene: Phaser.Scene, x: number, y: number, public info: EnemyInfo) {
        super(scene, x, y, info.key)
        this.scene = scene;
        scene.add.existing(this);
        this.depth = 50;
        this.anims.play(info.key + "_idle");
    }

    preUpdate(t: number, delta: number) {
        super.preUpdate(t, delta);
    }
}