import { BattleEntity, BattleStats } from "../entities/BattleEntity";
import { RadialUi } from "../entities/RadialUi";
import { BattleSystem, BattleStates } from "./BattleSystem";
import basicAttack from "./moves/basicAttack";
import penTest from "./moves/penTest";

export class BattleUi extends Phaser.GameObjects.Container {
    apMask: Phaser.GameObjects.Graphics;
    bg: Phaser.GameObjects.Sprite;
    fg: Phaser.GameObjects.Sprite;
    outline: Phaser.GameObjects.Sprite;
    ap: Phaser.GameObjects.Sprite;
    hpText: Phaser.GameObjects.Text;
    rui: RadialUi;

    constructor(scene: Phaser.Scene, public bsys: BattleSystem, public entity: BattleEntity) {
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

        this.hpText = scene.add.text(0, 0, "99", {
            fontFamily: "ARCADECLASSIC",
            fontSize: 16,
            color: "#FFFFFF",
            align: "center",
            stroke: "#000000",
            strokeThickness: 2
        }).setOrigin(0.5, 0.5);

        this.add([ this.bg, this.ap, this.apMask, this.outline, this.fg, this.hpText ]);
    }

    openRadial() {
        this.rui = new RadialUi(this.scene, 0, 0, {
            nodes: [
                {
                    key: "ico_atk",
                    onSelect: () => {
                        basicAttack(this.scene, this.entity, this.bsys.info.groupB[0], () => {
                            this.bsys.switchState(BattleStates.Active);
                        });
                    }
                },
                {
                    key: "ico_def",
                    onSelect: () => {
                        basicAttack(this.scene, this.entity, this.bsys.info.groupB[0], () => {
                            this.bsys.switchState(BattleStates.Active);
                        });
                    }
                },
                {
                    key: "ico_pentest",
                    onSelect: () => {
                        penTest(this.scene, this.entity, this.bsys.info.groupB[0], () => {
                            this.bsys.switchState(BattleStates.Active);
                        });
                    }
                },
            ]
        })
        this.add(this.rui);
    }

    update() {
        super.update();

        this.x = this.entity.ax;
        this.y = this.entity.ay - 50;

        this.apMask.clear();
        this.apMask.fillStyle(0x3d3d3d);
        this.apMask.slice(0, 0, 16, -Math.PI/2, (-Math.PI/2) + 0.01 + (this.entity.stats.ap*1.99*Math.PI), true);
        this.apMask.fillPath();

        if (!!this.rui) {
            this.rui.update();
        }
    }
}