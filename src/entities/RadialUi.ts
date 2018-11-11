import helpers from "../helpers";

export interface RadialUiConfig {
    nodes: RadialUiNode[];
}

export interface RadialUiNode {
    key: string;
    onSelect: Function;
}

const RUI_RADIUS = 40;

export class RadialUi extends Phaser.GameObjects.Container {
    nodes: Phaser.GameObjects.Sprite[];
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    selectedIdx: number = 0;
    lastTurnAt: number = -500;
    selectedNode: RadialUiNode;
    space: Phaser.Input.Keyboard.Key;
    faded: boolean = false;

    get thetaStep(): number {
        let t = (Math.PI*2)/this.config.nodes.length;
        return t;
    }

    get thetaOffset(): number {
        if (this.config.nodes.length % 2 == 0) return Math.PI / 2;
        else return 3*Math.PI/2;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, public config: RadialUiConfig) {
        super(scene, x, y);
        this.scene = scene;
        scene.add.existing(this);

        this.left = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.space = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.depth = 500;

        //this.add(scene.add.sprite(0, 0, "radialui"));

        this.nodes = [];
        for(let i = 0; i < config.nodes.length; i++) {
            const n = config.nodes[i];
            const theta = (i*this.thetaStep) + this.thetaOffset;
            const ix = Math.cos(theta)*RUI_RADIUS;
            const iy = Math.sin(theta)*RUI_RADIUS;
            const spr = scene.add.sprite(ix, iy, n.key);
            this.add(spr);
            this.nodes.push(spr);
        }

        this.setScale(0, 0);
        scene.tweens.add({
            targets: this,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: "Bounce.easeOut"
        });
    }

    turnDial(d: number) {
        const t = this.scene.time.now;
        if (t - this.lastTurnAt < 300) return;
        this.lastTurnAt = t;
        this.selectedIdx += d;
    }

    update() {
        super.update();

        for(let i = 0; i < this.nodes.length; i++) {
            const n = this.nodes[i];
            const theta = ((i + this.selectedIdx)*this.thetaStep) + this.thetaOffset;
            const ix = Math.cos(theta)*RUI_RADIUS;
            const iy = Math.sin(theta)*RUI_RADIUS;
            n.x = helpers.lerp(n.x, ix, 0.1);
            n.y = helpers.lerp(n.y, iy, 0.1);

            if (Math.abs(ix) < 0.1 && iy < 0) {
                this.selectedNode = this.config.nodes[i];
                const sint = (Math.sin(this.scene.time.now*0.01)*0.25)+0.125;
                n.scaleX = helpers.lerp(n.scaleX, 1 + sint, 0.1);
                n.scaleY = helpers.lerp(n.scaleY, 1 + sint, 0.1);
            } else {
                n.scaleX = helpers.lerp(n.scaleX, 1, 0.1);
                n.scaleY = helpers.lerp(n.scaleY, 1, 0.1);
            }
        }

        if (this.left.isDown) this.turnDial(-1);
        if (this.right.isDown) this.turnDial(1);
        if (this.space.isDown) this.select();
    }

    select() {
        this.fadeOut(() => {
            this.selectedNode.onSelect();
        });
    }

    fadeOut(cb: Function) {
        if (this.faded) return;
        this.faded = true;

        this.scene.tweens.add({
            targets: this,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 500,
            onComplete: cb,
            ease: "Power2.easeInOut"
        });
    }
}