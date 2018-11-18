    import { BattleEntity } from "../entities/BattleEntity";
    import helpers from "../helpers";
    import { BattleUi } from "./BattleUi";

export interface BattleInfo {
    groupA: BattleEntity[];
    groupB: BattleEntity[];
}

export enum BattleStates {
    GettingInFormation = 0,
    Active = 1,
    InTurn = 2,
    Victory = 3,
}

export class BattleSystem {
    state: BattleStates = BattleStates.GettingInFormation;
    allEntities: BattleEntity[];
    battleUis: BattleUi[] = [];

    constructor(public scene: Phaser.Scene, public info: BattleInfo, public victoryCallback: Function) {
        this.allEntities = info.groupA.concat(info.groupB);

        const formationAnchor = info.groupA[0];
        for(let i = 1; i < info.groupA.length; i++) {
            const e = info.groupA[i];
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

        for(let entity of this.allEntities) {
            entity.stats.inBattle = true;
        }

        scene.cameras.main.stopFollow();
    }

    switchState(state: BattleStates) {
        switch(state) {
            case BattleStates.GettingInFormation:
                break;
            case BattleStates.Active:
                if (this.state == BattleStates.GettingInFormation) {
                    for(let e of this.info.groupA) {
                        const bui = new BattleUi(this.scene, this, e);
                        this.battleUis.push(bui);
                    }
                }
                break;
            case BattleStates.InTurn:
                break;
        }

        this.state = state;

        if (state == BattleStates.Victory) {
            this.victoryCallback();
        }
    }

    update() {
        switch(this.state) {
            case BattleStates.GettingInFormation:
                break;
            case BattleStates.Active:
                for(let e of this.allEntities) {
                    e.stats.tick();

                    if (e.stats.dead) {
                        e.die();
                        continue;
                    }

                    if (e.stats.ap >= 1) {
                        if (e.isFriendly) {
                            const bui = this.battleUis.find(bui => bui.entity == e);
                            bui.openRadial();
                        } else {
                            e.aiPlayTurn(this.info.groupA, () => {
                                this.switchState(BattleStates.Active);
                            });
                        }
                        this.switchState(BattleStates.InTurn);
                        return;
                    }
                }

                const allEnemiesDead = !this.info.groupB.find(e => !e.stats.dead);

                if (allEnemiesDead) {
                    this.switchState(BattleStates.Victory);
                    return;
                }

                for(let ui of this.battleUis) ui.update();
                break;
            case BattleStates.InTurn:
                break;
        }

        if (this.state != BattleStates.Victory) {
            for(let bui of this.battleUis) {
                bui.update();
            }
        }
    }

    destroy() {
        for(let e of this.allEntities) {
            e.reset();
            e.stats.inBattle = false;
        }

        for(let bui of this.battleUis) {
            bui.destroy();
        }
    }
}