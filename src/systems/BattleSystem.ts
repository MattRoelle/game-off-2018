import { BattleEntity } from "../entities/BattleEntity";
import helpers from "../helpers";

export interface BattleInfo {
    groupA: BattleEntity[];
    groupB: BattleEntity[];
}

enum BattleStates {
    GettingInFormation = 0,
    Active = 1
}

class BattleUi extends Phaser.GameObjects.Container {
    apMask: Phaser.GameObjects.Graphics;
    bg: Phaser.GameObjects.Sprite;
    fg: Phaser.GameObjects.Sprite;
    outline: Phaser.GameObjects.Sprite;
    ap: Phaser.GameObjects.Sprite;
    constructor(scene: Phaser.Scene, public entity: BattleEntity) {
        super(scene, 0, 0);
        this.scene = scene;
        scene.add.existing(this);

        this.depth = 200;
        this.setScale(0, 0);
        scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 900,
            ease: "Bounce.easeOut"
        });

        this.bg = scene.add.sprite(0, 0, "battleui_base");
        this.fg = scene.add.sprite(0, 0, "battleui_fg");
        this.outline = scene.add.sprite(0, 0, "battleui_outline");

        this.ap = scene.add.sprite(0, 0, "battleui_ap");
        this.apMask = scene.make.graphics({});

        this.add([ this.bg, this.ap, this.apMask, this.outline, this.fg ]);
    }

    update() {
        super.update();

        this.x = this.entity.ax;
        this.y = this.entity.ay - 50;

        this.apMask.clear();
        this.apMask.fillStyle(0x3d3d3d);
        this.apMask.slice(0, 0, 16, -Math.PI/2, (-Math.PI/2) + 0.01 + (this.entity.stats.ap*1.99*Math.PI), true);
        this.apMask.fillPath();
        this.ap.setMask(this.apMask.createGeometryMask());
    }
}

export class BattleSystem {
    state: BattleStates = BattleStates.GettingInFormation;
    allEntities: BattleEntity[];
    battleUis: BattleUi[] = [];

    constructor(public scene: Phaser.Scene, public info: BattleInfo) {
        this.allEntities = info.groupA.concat(info.groupB);

        for(let e of this.allEntities) {
            e.stats.inBattle = true;
        }

        const formationAnchor = info.groupA[0];
        for(let i = 1; i < info.groupA.length; i++) {
            const e = info.groupA[i];
            console.log(e.formationXOffset, e.formationYOffset);
            scene.tweens.add({
                targets: e,
                ax: formationAnchor.ax + e.formationXOffset,
                ay: formationAnchor.ay + e.formationYOffset,
                duration: 1000,
                ease: "Power2",
                onComplete: () => {
                    if (i == 1) {
                        this.switchState(BattleStates.Active);
                    }
                }
            });
        }
    }

    switchState(state: BattleStates) {
        switch(state) {
            case BattleStates.GettingInFormation:
                break;
            case BattleStates.Active:
                console.log("QWE");
                for(let e of this.info.groupA) {
                    const bui = new BattleUi(this.scene, e);
                    this.battleUis.push(bui);
                }
                break;
        }
        this.state = state;
    }

    update() {
        this.scene.cameras.main.followOffset.y = helpers.lerp(this.scene.cameras.main.followOffset.y, -70, 0.1);
        switch(this.state) {
            case BattleStates.GettingInFormation:
                break;
            case BattleStates.Active:
                for(let e of this.allEntities) {
                    e.stats.tick();
                }
                for(let ui of this.battleUis) ui.update();
                break;
        }
    }
}