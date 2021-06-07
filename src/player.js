
export default class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.inventory = [
            {
                resource: 'iron',
                quantity: 0
            },
            {
                resource: 'bronze',
                quantity: 0
            },
        ];
    }

    collectFragment(fragment) {
        console.log(`Inventory consumed: ${fragment.name}`)
        const targetInventory = this.inventory.find((inventoryItem) => inventoryItem.resource == fragment.name);
        targetInventory.quantity++;

        console.log(this.inventory);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}