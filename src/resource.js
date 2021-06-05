import Fragment from "./fragment";


export default class Resource {
    static IRON_RADIUS = 10;
    static ironResource(x, y) {
        return new Resource(x, y, Resource.IRON_RADIUS, 'gray', 5, 10);
    }
    
    static BRONZE_RADIUS = 20;
    static bronzeResource(x, y) {
        return new Resource(x, y, Resource.BRONZE_RADIUS, 'brown', 10, 1);
    }

    constructor(x, y, radius, color, resourceCount, durability) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.startingRadius = radius;
        this.color = color;
        this.resourceCount = resourceCount;
        this.availableResources = resourceCount;
        this.durability = durability;
        this.hitCount = 0;
    }

    mine(damage) {
        if (this.availableResources <= 0)
        {
            return;
        }

        for (damage; damage > 0; damage--)
        {
            this.hitCount++;
            if (this.hitCount % this.durability == 0) {
                const frag = this.releaseFragment();
                this.decreaseSize();
                return frag;
            }
        }
    }

    releaseFragment() {
        this.availableResources--;

        var randomAngle = Math.random() * (Math.PI * 2);

        const velocity = {
            x: Math.cos(randomAngle) * 2,
            y: Math.sin(randomAngle) * 2
        }
        const frag = new Fragment(this.x, this.y, 10, this.color, velocity);
        return frag;
    }

    decreaseSize() {
        // reduce size a percentage of how many resources were removed.
        var percentResourcesLeft = this.availableResources / this.resourceCount;
        this.radius = this.startingRadius * percentResourcesLeft;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}