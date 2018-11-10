import { Player } from "../Player";
import helpers from "../../helpers";

export default {
    preUpdate(player: Player) {
        let dx = 0;
        let dy = 0;

        if (!player.info.isCom) {
            if (player.left.isDown) dx = -1;
            else if (player.right.isDown) dx = 1;
            if (player.up.isDown) dy = -1;
            else if (player.down.isDown) dy = 1;
        } else {
            const distToFollow = player.distToFollow;

            if (!player.followMove && distToFollow > 60) {
                player.followMove = true;
            } else if (!player.info.following.flying && player.followMove && distToFollow < 40) {
                player.followMove = false;
            }

            if (player.followMove) {
                dx = player.info.following.container.x - player.container.x;
                dy = player.info.following.container.y - player.container.y;
            }
        }

        this.move(player, dx, dy);
    },

    move(player: Player, dx: number, dy: number) {
        dx = helpers.clamp(-1, 1, dx);
        dy = helpers.clamp(-1, 1, dy);

        if (dx == 0 && dy == 0) {
            player.targetAngle = 0;
            player.flying = false;
            return;
        }

        player.flying = true;

        if (dx > 0) player.targetAngle = 1;
        else if (dx < 0) player.targetAngle = -1;
        else player.targetAngle = 0;

        const theta = Math.atan2(dy, dx);

        let f = 3;
        if (player.info.isCom) f *= 0.92;
        if (player.info.isCom && player.distToFollow < 30) f *= 0.7;


        player.container.x += Math.cos(theta)*f;
        player.container.y += Math.sin(theta)*f;
    }
}