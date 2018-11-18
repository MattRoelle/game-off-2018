import ScaleManager from "./scaleManager";
import { MainScene } from "./scenes/MainScene";

export class GithubGameOff {
    private _game: Phaser.Game;

    constructor() {
        this._game = new Phaser.Game({
            width: 960,
            height: 540,
            type: Phaser.AUTO,
            zoom: 2,
            render: {
                pixelArt: true,
            },
            scene: MainScene,
            physics: {
                default: "matter",
                matter: {
                    gravity: { x: 0, y: 0 },
                    debug: true
                }
            },
            callbacks: {
                postBoot: () => {
                    new ScaleManager(this._game.canvas, !this._game.device.os.desktop);
                }
            }
        });
    }
}