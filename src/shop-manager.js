export default class ShopManager {
    constructor(player) {
        this.playerShopItems = {
            movement1: {
                display: 'Movement 1',
                cost: [
                   {resource: 'bronze', amount: 10}
                ],
                reward: .25,
                purchased: false
            },
            movement2: {
                display: 'Movement 2',
                cost: [
                    {resource: 'iron', amount: 500},
                    {resource: 'bronze', amount: 1000}
                ],
                reward: 1,
                purchased: false
            }
        }
        this.weaponShopItems = {
            speed1: {
                display: 'Speed 1',
                cost: [
                    {resource: 'bronze', amount: 100}
                ],
                reward: 1,
                purchased: false
            },
            damage1: {
                display: 'Damage 1',
                cost: [
                    {resource: 'iron', amount: 50},
                    {resource: 'bronze', amount: 220}
                ],
                reward: 1,
                purchased: false
            }
        }
        this.populatePlayerShop(player);
        this.populateWeaponShop();
    }

    populatePlayerShop(player) {
        const playerShopItemsElement = document.getElementById('player-shop-items');
        for (const[key, value] of Object.entries(this.playerShopItems)) {
            // <div><span>Movement 1</span><button>100 Iron</button></div>
            let costString = '';
            for (let i = 0; i < value.cost.length; i++) {
                costString += value.cost[i].amount + ' ' + value.cost[i].resource + '<br>';
            }
            const elementString = this.htmlToElement(`<div><span>${value.display}</span><button id="purchase${key}">${costString}</button></div>`);
            playerShopItemsElement.appendChild(elementString);
            document.getElementById(`purchase${key}`).onclick = () => Object.getPrototypeOf(this)[`purchase${key}`].call(this, player);
            // document.getElementById(`purchase${key}`).onclick = () => Object.getPrototypeOf(player)[`purchase${key}`].call(player, this);
        }
    }

    purchasemovement1(player) {
        // Check to see if player can afford the item
        const shopItem = this.playerShopItems['movement1'];
        for (let i = 0; i < shopItem.cost.length; i++) {
            const cost = shopItem.cost[i];
            if (player.inventory[cost.resource] < cost.amount) {
                window.alert('Cant afford!');
                return;
            }
        }

        // deduct cost from player inventory
        for (let i = 0; i < shopItem.cost.length; i++) {
            const cost = shopItem.cost[i];
            player.inventory[cost.resource] -= cost.amount;
            player.updateInventoryCount(cost.resource);
        }

        player.stats.movementSpeed += shopItem.reward;
        player.setStatsOnScreen();
    }

    purchasemovement2(player) {
        console.log(player);
    }

    populateWeaponShop() {
        // for (const[key, value] of Object.entries(this.playerShopItems)) {
            
        //     const spanString = ``
        // }
    }

    htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }
}