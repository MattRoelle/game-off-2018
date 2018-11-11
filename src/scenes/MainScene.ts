import { Player } from "../entities/Player";
import { Enemy } from "../entities/Enemy";
import { BattleEntity } from "../entities/BattleEntity";
import helpers from "../helpers";
import { BattleSystem } from "../systems/BattleSystem";
import { RadialUi, RadialUiConfig } from "../entities/RadialUi";

export class MainScene extends Phaser.Scene {
    player: Player;
    party: Player[];
    enemies: BattleEntity[];
    battle: BattleSystem;
    rui: RadialUi;

    constructor() {
        super({
            key: "MainScene"
        });
    }

    preload() {
        this.load.image("battleui_fg", "/assets/battleui_fg.png");
        this.load.image("battleui_ap", "/assets/battleui_ap.png");
        this.load.image("battleui_base", "/assets/battleui_base.png");
        this.load.image("battleui_outline", "/assets/battleui_outline.png");
        this.load.image("shadow", "/assets/shadow.png");
        this.load.image("radialui", "/assets/radialui.png");
        this.load.image("ico_atk", "/assets/ico_atk.png");
        this.load.image("octocat1", "/assets/octocat.png");
        this.load.image("octocat2", "/assets/octocat2.png");
        this.load.image("octocat3", "/assets/octocat3.png");
        this.load.spritesheet("hover_flame", "/assets/hover_flame.png", {
            startFrame: 0,
            endFrame: 40,
            frameWidth: 100,
            frameHeight: 100
        });
        this.load.spritesheet("slime1", "/assets/slime1.png", {
            startFrame: 0,
            endFrame: 7,
            frameWidth: 40,
            frameHeight: 40
        });

        this.load.image("tiles", "/assets/tilemap.png");
        this.load.tilemapTiledJSON("level1", "/assets/levels/level1.json");
    }

    create() {
        this.anims.create({
            key: "slime1_idle",
            frames: this.anims.generateFrameNumbers("slime1", { start: 0, end: 3 }),
            yoyo: true,
            frameRate: 8,
            repeat: -1
        });

        const map = this.make.tilemap({
            key: "level1",
            tileWidth: 20,
            tileHeight: 20
        });
        const tilesetImg = map.addTilesetImage("tilemap", "tiles");

        for (let i = 0; i < map.layers.length; i++) {
            const layer = map.layers[0];
            map.createStaticLayer(i, tilesetImg, layer.x, layer.y);
        }

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = new Player(this, { isCom: false, key: "octocat1", partyIdx: 0 });
        const player2 = new Player(this, { isCom: true, key: "octocat2", following: this.player, partyIdx: 1 });
        const player3 = new Player(this, { isCom: true, key: "octocat3", following: player2, partyIdx: 2 });

        this.party = [this.player, player2, player3];

        this.cameras.main.startFollow(this.player.container);

        const e = new Enemy(this, 450, 650, {
            key: "slime1",
        });

        this.enemies = [e];
    }

    update() {
        if (this.battle) {
            this.cameras.main.zoom = helpers.lerp(this.cameras.main.zoom, 1.5, 0.02);
            this.battle.update();
        } else {
            this.cameras.main.zoom = helpers.lerp(this.cameras.main.zoom, 1, 0.02);
            this.cameras.main.followOffset.y = helpers.lerp(this.cameras.main.followOffset.y, 0, 0.1);
            for (let e of this.enemies) {
                if (helpers.dist(this.player.container, e) < 90) {
                    this.battle = new BattleSystem(this, {
                        groupA: this.party,
                        groupB: [e]
                    })
                }
            }
        }
    }
}