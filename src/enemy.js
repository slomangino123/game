import Projectile from "./projectile";

export default class Enemy {

}

export class DiamondDefender extends Enemy {
    constructor(x, y, radius, color, health, diamondToDefend, parentChunk) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.health = health;
        this.diamondToDefend = diamondToDefend;

        // Behaviors:
        // 0: defending
        // 1: attacking
        this.behavior = 0;
        this.wanderingDistance = 250;
        this.waypoint = {x: this.x, y: this.y};
        this.setNextWaypoint(parentChunk);
        this.waiting = 20;
        this.aggroRange = 350;
        this.resetFireRate();
    }

    resetFireRate() {
        this.fireRate = 50;
    }

    getScreenX(parentChunk) {
        return this.x + parentChunk.x;
    }

    getScreenY(parentChunk) {
        return this.y + parentChunk.y;
    }

    getWaypointX(parentChunk) {
        return this.waypoint.x + parentChunk.x;
    }

    getWaypointY(parentChunk) {
        return this.waypoint.y + parentChunk.y;
    }

    getDefencePointX(parentChunk) {
        return this.diamondToDefend.x + parentChunk.x;
    }

    getDefencePointY(parentChunk) {
        return this.diamondToDefend.y + parentChunk.y;
    }

    draw(context, parentChunk) {
        context.beginPath();
        context.arc(this.getScreenX(parentChunk), this.getScreenY(parentChunk), this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();

        // Draw the waypoint they are heading to.
        // context.beginPath();
        // context.arc(this.getWaypointX(parentChunk), this.getWaypointY(parentChunk), 5, 0, Math.PI * 2, false);
        // context.fillStyle = this.color;
        // context.fill();
    }
    
    setNextWaypoint(parentChunk) {
        const waypointX = Math.floor(this.diamondToDefend.x + ((Math.random() - .5) * this.wanderingDistance));
        const waypointY = Math.floor(this.diamondToDefend.y + ((Math.random() - .5) * this.wanderingDistance));

        this.waypoint.x = waypointX;
        this.waypoint.y = waypointY;

        const angle = Math.atan2(this.getWaypointY(parentChunk) - this.getScreenY(parentChunk), this.getWaypointX(parentChunk) - this.getScreenX(parentChunk));
    
        const speedMultiplier = 2;
    
        this.velocity = {
            x: Math.cos(angle) * speedMultiplier,
            y: Math.sin(angle) * speedMultiplier,
        }
    }

    nearwaypoint(parentChunk) {
        const distance = Math.hypot(this.getWaypointX(parentChunk) - this.getScreenX(parentChunk), this.getWaypointY(parentChunk) - this.getScreenY(parentChunk));
        if (distance > 10) {
            return false
        }

        return true;
    }

    update(context, parentChunk, player) {
        this.draw(context, parentChunk);
        const enemyProjectiles = [];

        // defending
        if (this.behavior === 0) {
            // Enemy should wander around the defencePoint but not too far
            if (this.nearwaypoint(parentChunk)) {
                if (this.waiting === 0) {
                    // Waiting is over, set the next waypoint
                    this.setNextWaypoint(parentChunk);
                    // Set next time to wait
                    this.waiting = Math.floor(Math.random() * 40);
                } else {
                    // Wait around for the waiting period
                    this.waiting--;
                }
            } else {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }

            // check distance to player to see if within aggro range
            const distanceFromDiamondToPlayer = this.getDistanceFromDiamondToPlayer(parentChunk, player);
            if (distanceFromDiamondToPlayer < this.aggroRange) {
                this.behavior = 1;
            }
        }
        // attacking
        else if (this.behavior === 1) {
            const distanceFromDiamondToPlayer = this.getDistanceFromDiamondToPlayer(parentChunk, player);
            // player moves outside of aggro range, resume defensive maneuvers.
            if (distanceFromDiamondToPlayer > this.aggroRange + 100) {
                this.behavior = 0;
            }

            // Get angle from enemy to player
            const angle = Math.atan2(player.y - this.getScreenY(parentChunk), player.x - this.getScreenX(parentChunk));
            // const angle = Math.atan2(player.y - this.y, player.x - this.x);

            const speedMultiplier = 5;

            const enemyProjectileVelocity = {
                x: Math.cos(angle) * speedMultiplier,
                y: Math.sin(angle) * speedMultiplier,
            }

            if (this.fireRate <= 0) {
                this.resetFireRate();
                enemyProjectiles.push(
                    new Projectile(
                        this.getScreenX(parentChunk),
                        this.getScreenY(parentChunk),
                        5,
                        'green',
                        enemyProjectileVelocity,
                        this.damage
                ))
            }
            this.fireRate--;
        }

        return enemyProjectiles;
    }

    getDistanceFromDiamondToPlayer(parentChunk, player) {
        const distance = Math.hypot(this.diamondToDefend.x + parentChunk.x - player.x, this.diamondToDefend.y + parentChunk.y - player.y);
        return distance;
    }
}