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
    tilebg: Phaser.GameObjects.TileSprite;
    tilebg2: Phaser.GameObjects.TileSprite;
    walkablePolygons: number[][];

    constructor() {
        super({
            key: "MainScene"
        });
    }

    preload() {
        this.load.image("tilebg", "/assets/tilebg.png");
        this.load.image("tilebg2", "/assets/tilebg2.png");
        this.load.image("battleui_fg", "/assets/battleui_fg.png");
        this.load.image("battleui_ap", "/assets/battleui_ap.png");
        this.load.image("battleui_base", "/assets/battleui_base.png");
        this.load.image("battleui_outline", "/assets/battleui_outline.png");
        this.load.image("shadow", "/assets/shadow.png");
        this.load.image("radialui", "/assets/radialui.png");
        this.load.image("ico_atk", "/assets/ico_atk.png");
        this.load.image("ico_def", "/assets/ico_def.png");
        this.load.image("ico_pentest", "/assets/ico_pentest.png");
        this.load.image("pen_arrow1", "/assets/pen_arrow.png");
        this.load.image("pen_arrow2", "/assets/pen_arrow2.png");
        this.load.image("pen_arrow3", "/assets/pen_arrow3.png");

        this.load.spritesheet("hit1", "/assets/hit1.png", { startFrame: 0, endFrame: 5, frameWidth: 20, frameHeight: 20 });

        const octoConf = {
            startFrame: 0,
            endFrame: 2,
            frameWidth: 40,
            frameHeight: 40
        };

        this.load.spritesheet("octocat1", "/assets/octocat.png", octoConf);
        this.load.spritesheet("octocat2", "/assets/octocat.png", octoConf);
        this.load.spritesheet("octocat3", "/assets/octocat.png", octoConf);

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
        this.tilebg = this.add.tileSprite(1000, 1000, 5000, 5000, "tilebg");
        this.tilebg2 = this.add.tileSprite(1000, 1000, 5000, 5000, "tilebg2");

        this.anims.create({
            key: "hit1_anim",
            frames: this.anims.generateFrameNames("hit1",{ start: 0, end: 5}),
            repeat: 0,
            frameRate: 20
        });

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
            const layer = map.layers[i];
            map.createStaticLayer(i, tilesetImg, layer.x, layer.y);
        }

        this.walkablePolygons = [];
        for(let objLayer of map.objects) {
            if (objLayer.name == "collision") {
                for(let obj of <any[]>objLayer.objects) {
                    const verts = [];
                    for(let vert of obj.polygon) {
                        const vx = vert.x + obj.x;
                        const vy = vert.y + obj.y;
                        verts.push(vx);
                        verts.push(vy);
                    }
                    this.walkablePolygons.push(verts);
                }
            }
        }

        console.log(this.walkablePolygons);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.player = new Player(this, { isCom: false, key: "octocat1", partyIdx: 0 });
        const player2 = new Player(this, { isCom: true, key: "octocat2", following: this.player, partyIdx: 1 });
        const player3 = new Player(this, { isCom: true, key: "octocat3", following: player2, partyIdx: 2 });

        this.party = [this.player, player2, player3];

        this.cameras.main.startFollow(this.player.container);
        this.cameras.main.setFollowOffset(0, -80);

        const e = new Enemy(this, 450, 650, {
            key: "slime1",
        });

        const e2 = new Enemy(this, 750, 250, {
            key: "slime1",
        });

        this.enemies = [e, e2];
    }

    update() {
        this.tilebg.tilePositionX += 1;
        this.tilebg.tilePositionY -= 2;
        this.tilebg2.tilePositionX += 0.5;
        this.tilebg.tilePositionY -= 1.2;

        if (!!this.battle) {
            this.cameras.main.zoom = helpers.lerp(this.cameras.main.zoom, 1.5, 0.02);
            this.battle.update();
        } else {
            this.cameras.main.zoom = helpers.lerp(this.cameras.main.zoom, 1, 0.02);
            for (let e of this.enemies) {
                if (e.stats.dead) continue;
                if (helpers.dist(this.player.container, e) < 90) {
                    this.battle = new BattleSystem(this, {
                        groupA: this.party,
                        groupB: [e]
                    }, () => {
                        this.cameras.main.startFollow(this.player.container);
                        this.battle.destroy();
                        this.battle = null;
                    });
                    return;
                }
            }
        }
    }
}