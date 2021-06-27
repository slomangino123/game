import Fragment from "./fragment";


export class Resource {
    static BRONZE_RADIUS = 50;
    static bronzeResource(x, y) {
        return new Resource(x, y, Resource.BRONZE_RADIUS, 'brown', 10, 1, 'bronze');
    }

    constructor(x, y, radius, color, resourceCount, durability, name, imageSrc) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startingRadius = radius;
        this.color = color;
        this.resourceCount = resourceCount;
        this.availableResources = resourceCount;
        this.durability = durability;
        this.name = name;
        this.hitCount = 0;
        const sprite = new Image();
        sprite.src = imageSrc;
        this.sprite = sprite;
    }

    mine(damage, parentChunk) {
        if (this.availableResources <= 0)
        {
            return;
        }

        const fragmentsToCreate = [];
        for (damage; damage > 0; damage--)
        {
            this.hitCount++;
            if (this.hitCount % this.durability == 0) {
                if (this.availableResources > 0) {
                    const frag = this.releaseFragment(parentChunk);
                    fragmentsToCreate.push(frag);
                }
                this.decreaseSize();
            }
        }

        return fragmentsToCreate;
    }

    releaseFragment(parentChunk) {
        this.availableResources--;

        var randomAngle = Math.random() * (Math.PI * 2);

        const velocity = {
            x: Math.cos(randomAngle) * 2,
            y: Math.sin(randomAngle) * 2
        }
        const frag = new Fragment(this.getScreenX(parentChunk), this.getScreenY(parentChunk), 10, this.color, velocity, this.name);
        return frag;
    }

    decreaseSize() {
        // reduce size a percentage of how many resources were removed.
        var percentResourcesLeft = this.availableResources / this.resourceCount;
        this.radius = (this.startingRadius) * percentResourcesLeft;
        if (this.radius <= 0) {
            this.radius = 0;
            return;
        }

        if (this.radius < 10)
        {
            this.radius = 10;
        }
    }

    getScreenX(parentChunk) {
        return this.x + parentChunk.x;
    }

    getScreenY(parentChunk) {
        return this.y + parentChunk.y;
    }

    draw(context, parentChunk) {
        // context.beginPath();
        // context.arc(this.getScreenX(parentChunk), this.getScreenY(parentChunk), this.radius, 0, Math.PI * 2, false);
        // context.fillStyle = this.color;
        // context.fill();
        context.drawImage(this.sprite, this.getScreenX(parentChunk)-49, this.getScreenY(parentChunk)-48)
    }

    update(context, parentChunk) {
        this.draw(context, parentChunk);
    }
}

export class Iron extends Resource {
    static RADIUS = 10;
    constructor(x, y) {
        super(x, y, Iron.RADIUS, 'gray', 5, 10, 'iron', 'assets/resource/meteorGrey_big4.png');
    }
}

export class Bronze extends Resource {
    static RADIUS = 50;
    constructor(x, y) {
        super(x, y, Bronze.RADIUS, 'brown', 10, 1, 'bronze', 'assets/resource/meteorBrown_big4.png');
    }
}


export class Diamond extends Resource {
    static RADIUS = 10;
    constructor(x, y) {
        super(x, y, Diamond.RADIUS, 'white', 5, 20, 'bronze', 'assets/resource/meteorBrown_big4.png');
        this.angle = Math.atan2(0, 0);
    }

    draw(context, parentChunk) {
        const a = {x: this.getScreenX(parentChunk), y: this.getScreenY(parentChunk) - this.radius};
        const b = {x: this.getScreenX(parentChunk) + this.radius, y: this.getScreenY(parentChunk) + this.radius};
        const c = {x: this.getScreenX(parentChunk) - this.radius, y: this.getScreenY(parentChunk) + this.radius};

        context.translate(this.getScreenX(parentChunk), this.getScreenY(parentChunk));
        context.rotate(this.angle);
        context.translate(-this.getScreenX(parentChunk), -this.getScreenY(parentChunk));


        const origin = {x: this.getScreenX(parentChunk), y: this.getScreenY(parentChunk)};
        const sixtyDegrees = Math.PI/3

        // Set first point
        const firstPoint = {x: origin.x + this.radius, y: origin.y};

        // find second point
        const secondX = Math.cos(sixtyDegrees) * this.radius;
        const secondY = Math.sin(sixtyDegrees) * this.radius;
        const secondPoint = {x: origin.x - 
            secondX, y: origin.y - secondY};

        // find third point
        const thirdX = Math.cos(sixtyDegrees) * this.radius;
        const thirdY = Math.sin(sixtyDegrees) * this.radius;
        const thirdPoint = {x: origin.x - thirdX, y: origin.y + thirdY};

        context.beginPath();
        context.moveTo(firstPoint.x, firstPoint.y);
        context.lineTo(secondPoint.x, secondPoint.y);
        context.lineTo(thirdPoint.x, thirdPoint.y);
        context.lineTo(firstPoint.x, firstPoint.y);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        context.resetTransform();
    }

    getPoints() {
    }

    update(context, parentChunk) {
        this.draw(context, parentChunk);

        this.angle += Math.PI / 10;
    }
}