export default class ShopManager {
    constructor(player) {
        this.playerShopItems = {
            movement: {
                display: 'Movement',
                tiers: [
                    {
                        tier: "1",
                        reward: .25,
                        cost: [
                            { resource: 'bronze', amount: 1 }
                        ],
                        purchased: false
                    },
                    {
                        tier: "2",
                        reward: .2,
                        cost: [
                            { resource: 'bronze', amount: 1 },
                            // { resource: 'iron', amount: 10 }
                        ],
                        purchased: false
                    },
                    {
                        tier: "3",
                        reward: .1,
                        cost: [
                            { resource: 'bronze', amount: 1 },
                            // { resource: 'iron', amount: 100 }
                        ],
                        purchased: false
                    },
                ]
            }
        }
        this.weaponShopItems = {
            damage: {
                display: 'Damage',
                tiers: [
                    {
                        tier: "1",
                        reward: 1,
                        cost: [
                            {resource: 'bronze', amount: 1},
                            // {resource: 'iron', amount: 50},
                        ],
                        purchased: false
                    },
                    {
                        tier: "2",
                        reward: 1,
                        cost: [
                            {resource: 'bronze', amount: 1},
                            // {resource: 'iron', amount: 50},
                        ],
                        purchased: false
                    }
                ]
            }
        }
        this.populatePlayerShop(player);
        this.populateWeaponShop(player);
    }

    populatePlayerShop(player) {
        const playerShopItemsElement = document.getElementById('player-shop-items');
        for (const[key, value] of Object.entries(this.playerShopItems)) {
            const currentTier = value.tiers.find(tier => !tier.purchased);
            const costString = this.generateCostString(currentTier);
            const elementString = this.htmlToElement(`<div class="player-shop-item"><span id="${key}-item">${value.display} ${currentTier.tier}</span><button id="purchase-${key}">${costString}</button></div>`);
            playerShopItemsElement.appendChild(elementString);
            document.getElementById(`purchase-${key}`).onclick = () => Object.getPrototypeOf(this)[`purchase${key}`].call(this, player);
        }
    }

    populateWeaponShop(player) {
        const weaponShopItemsElement = document.getElementById('weapon-shop-items');
        for (const[key, value] of Object.entries(this.weaponShopItems)) {
            const currentTier = value.tiers.find(tier => !tier.purchased);
            const costString = this.generateCostString(currentTier);
            const elementString = this.htmlToElement(`<div class="weapon-shop-item"><span id="${key}-item">${value.display} ${currentTier.tier}</span><button id="purchase-${key}">${costString}</button></div>`);
            weaponShopItemsElement.appendChild(elementString);
            document.getElementById(`purchase-${key}`).onclick = () => Object.getPrototypeOf(this)[`purchase${key}`].call(this, player);
        }
    }

    generateCostString(tier) {
        let costString = '';
        for (let i = 0; i < tier.cost.length; i++) {
            costString += tier.cost[i].amount + ' ' + tier.cost[i].resource + '<br>';
        }
        return costString;
    }

    purchasemovement(player) {
        // Check to see if player can afford the item
        const shopItem = this.playerShopItems['movement'];
        const currentTier = shopItem.tiers.find(tier => !tier.purchased);
        for (let i = 0; i < currentTier.cost.length; i++) {
            const cost = currentTier.cost[i];
            if (player.inventory[cost.resource] < cost.amount) {
                window.alert('Cant afford!');
                return;
            }
        }

        // deduct cost from player inventory
        for (let i = 0; i < currentTier.cost.length; i++) {
            const cost = currentTier.cost[i];
            player.inventory[cost.resource] -= cost.amount;
            player.updateInventoryCount(cost.resource);
        }

        player.stats.movementSpeed += currentTier.reward;
        currentTier.purchased = true;
        player.setStatsOnScreen();

        const tierDisplay = document.getElementById('movement-item');
        const purchaseButton = document.getElementById('purchase-movement');

        // Update the shop element values
        const nextTier = shopItem.tiers.find(tier => !tier.purchased);
        if (!nextTier) {
            // gray this button out? They've purchased all the tiers
            tierDisplay.innerHTML = `${shopItem.display} (Purchased)`
            purchaseButton.disabled = true;
            purchaseButton.style.display = 'none';
            return;
        }
        
        tierDisplay.innerHTML = `${shopItem.display} ${nextTier.tier}`;
        const costString = this.generateCostString(nextTier);
        purchaseButton.innerHTML = costString;
    }

    purchasedamage(player) {
        // Check to see if player can afford the item
        const shopItem = this.weaponShopItems['damage'];
        const currentTier = shopItem.tiers.find(tier => !tier.purchased);
        for (let i = 0; i < currentTier.cost.length; i++) {
            const cost = currentTier.cost[i];
            if (player.inventory[cost.resource] < cost.amount) {
                window.alert('Cant afford!');
                return;
            }
        }

        // deduct cost from player inventory
        for (let i = 0; i < currentTier.cost.length; i++) {
            const cost = currentTier.cost[i];
            player.inventory[cost.resource] -= cost.amount;
            player.updateInventoryCount(cost.resource);
        }

        player.stats.weaponDamage += currentTier.reward;
        currentTier.purchased = true;
        player.setStatsOnScreen();

        // Update the shop element values
        const nextTier = shopItem.tiers.find(tier => !tier.purchased);
        if (!nextTier) {
            // gray this button out? They've purchased all the tiers
            const purchaseButton = document.getElementById('purchase-damage');
            purchaseButton.disabled = true;
            return;
        }
        
        const tierDisplay = document.getElementById('damage-item');
        tierDisplay.innerHTML = `${shopItem.display} ${nextTier.tier}`;
        const purchaseButton = document.getElementById('purchase-damage');
        const costString = this.generateCostString(nextTier);
        purchaseButton.innerHTML = costString;
    }

    htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
}