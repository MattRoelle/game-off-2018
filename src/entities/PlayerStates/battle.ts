import { Player } from "../Player";

export default {
    preUpdate(player: Player) {
        player.targetAngle = 0;
        player.flying = true;
    }
}