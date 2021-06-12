
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

    draw(context, mouseX, mouseY) {
        const angle = Math.atan2(mouseY - this.y, mouseX - this.x) + Math.PI/2;

        const a = {x: this.x, y: this.y - 40};
        const b = {x: this.x + 30, y: this.y + 20};
        const c = {x: this.x - 30, y: this.y + 20};

        context.translate(this.x, this.y);
        context.rotate(angle);
        context.translate(-this.x, -this.y);

        context.beginPath();

        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.lineTo(c.x, c.y);
        context.lineTo(a.x, a.y);

        context.fillStyle = this.color;
        context.fill();
        context.resetTransform();
    }
}