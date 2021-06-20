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
        this.setPointNearDefencePoint(parentChunk);
        this.waiting = 20;
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

        context.beginPath();
        context.arc(this.getWaypointX(parentChunk), this.getWaypointY(parentChunk), 5, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
    
    setPointNearDefencePoint(parentChunk) {
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

    update(context, parentChunk) {
        this.draw(context, parentChunk);

        // defending
        if (this.behavior === 0) {
            // Enemy should wander around the defencePoint but not too far
            if (this.nearwaypoint(parentChunk)) {
                if (this.waiting === 0) {
                    this.setPointNearDefencePoint(parentChunk);
                    this.waiting = Math.floor(Math.random() * 40);
                } else {
                    this.waiting--;
                }
            } else {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }
        }
    }
}