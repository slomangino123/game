
export default class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        
        this.stats = {
            movementSpeed: 1,
            weaponSpeed: 1,
            weaponDamage: 1,
        };
        this.inventory = {
            iron: 0,
            bronze: 0
        }
        this.setStatsOnScreen();
    }

    getTrueWeaponSpeed() {
        return (this.stats.weaponSpeed * 500);
    }

    collectFragment(fragment, inventoryElements) {
        this.inventory[fragment.name]++;
        this.updateInventoryCount(fragment.name);
        // const inventoryElement = inventoryElements.find((element) => element.itemName == fragment.name);
        // if (inventoryElement) {
        //     inventoryElement.element.innerHTML = this.inventory[fragment.name];
        // }
    }

    updateInventoryCount(inventoryItem) {
        const element = document.getElementById(`${inventoryItem}-count`);
        element.innerHTML = this.inventory[inventoryItem];
    }

    setStatsOnScreen() {
        const movementElement = document.getElementById('movement');
        movementElement.innerHTML = this.stats.movementSpeed;

        const weaponSpeedElement = document.getElementById('weapon-speed');
        weaponSpeedElement.innerHTML = this.stats.weaponSpeed;

        const weaponDamageElement = document.getElementById('weapon-damage');
        weaponDamageElement.innerHTML = this.stats.weaponDamage;
    }

    draw(context, mouseX, mouseY) {
        const playerSprite = new Image();
        playerSprite.src = 'assets/player/playerShip3_blue.png';


        const angle = Math.atan2(mouseY - this.y, mouseX - this.x) + Math.PI/2;

        // const a = {x: this.x, y: this.y - 40};
        // const b = {x: this.x + 30, y: this.y + 20};
        // const c = {x: this.x - 30, y: this.y + 20};

        context.translate(this.x, this.y);
        context.rotate(angle);
        context.translate(-this.x, -this.y);
        context.drawImage(playerSprite, this.x-49, this.y-37);

        // context.beginPath();

        // context.moveTo(a.x, a.y);
        // context.lineTo(b.x, b.y);
        // context.lineTo(c.x, c.y);
        // context.lineTo(a.x, a.y);

        // context.fillStyle = this.color;
        // context.fill();
        context.resetTransform();
    }
}