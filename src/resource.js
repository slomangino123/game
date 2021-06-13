import Fragment from "./fragment";


export default class Resource {
    static IRON_RADIUS = 10;
    static ironResource(x, y) {
        return new Resource(x, y, Resource.IRON_RADIUS, 'gray', 5, 10, 'iron');
    }
    
    static BRONZE_RADIUS = 50;
    static bronzeResource(x, y) {
        return new Resource(x, y, Resource.BRONZE_RADIUS, 'brown', 10, 1, 'bronze');
    }

    constructor(x, y, radius, color, resourceCount, durability, name) {
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
                const frag = this.releaseFragment(parentChunk);
                this.decreaseSize();
                fragmentsToCreate.push(frag);
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
        if (this.radius === 0) {
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
        context.beginPath();
        context.arc(this.getScreenX(parentChunk), this.getScreenY(parentChunk), this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}