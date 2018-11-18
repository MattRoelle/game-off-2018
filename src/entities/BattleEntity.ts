export class BattleStats {
    hp: number;
    ap: number;
    apRate: number;
    inBattle: boolean = false;

    get dead(): boolean {
        return this.hp <= 0;
    }

    constructor() {
        this.hp = 99;
        this.ap = 0;
        this.apRate = 0.004;
    }

    tick() {
        if (this.dead) return;
        this.ap += this.apRate;
        this.ap = Math.min(this.ap, 1);
    }

    damage(n: number) {
        this.hp -= n;
    }
    victoryCallback: Function;
}

export interface BattleEntity {
    ax: number;
    ay: number;
    aangle: number;
    isFriendly: boolean;
    formationXOffset: number;
    formationYOffset: number;
    stats: BattleStats;
    aiPlayTurn?(groupB: BattleEntity[], cb: Function): void;
    hit(): void;
    die(): void;
    casting(): void;
    reset(): void;
}