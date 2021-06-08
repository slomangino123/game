
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

    collectFragment(fragment, inventoryElements) {
        const targetInventory = this.inventory.find((inventoryItem) => inventoryItem.resource == fragment.name);
        targetInventory.quantity++;
        const inventoryElement = inventoryElements.find((element) => element.itemName == fragment.name);
        if (inventoryElement) {
            inventoryElement.element.innerHTML = targetInventory.quantity;
        }

    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}