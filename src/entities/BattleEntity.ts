export class BattleStats {
    hp: number;
    ap: number;
    apRate: number;
    inBattle: boolean = false;

    constructor() {
        this.hp = 99;
        this.ap = 0;
        this.apRate = 0.004;
    }

    tick() {
        this.ap += this.apRate;
        this.ap = Math.min(this.ap, 1);
    }
}

export interface BattleEntity {
    ax: number;
    ay: number;
    isFriendly: boolean;
    formationXOffset: number;
    formationYOffset: number;
    stats: BattleStats;
}