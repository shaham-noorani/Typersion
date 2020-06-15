var fs = require("fs")
var path = require('path')

var Player

var itemTierNames

function updatesItemsFromJSON() {
    fs.readFile(path.join(__dirname, "static/items.json") , (err, data) => {
        if (err) { console.error(err) }
        itemTierNames = JSON.parse(data).itemTierNames
    })
}

function rollDropItem() {
    var player = Player.getPlayer()
    var luck = player.stats.luck * player.equipmentEffects.luckMultiplier

    var rng = Math.floor(Math.random() * 100) + 1
    rng += luck

    if (rng >= 95) {
        givePlayerRareItem()
    }
    else if (rng >= 90) {
        givePlayerNormalItem()
    }
}

function givePlayerNormalItem() {
    var player = Player.getPlayer()
    var rng = Math.floor(Math.random() * 3) + 1
    var tier = Math.floor(player.stage / 10) + 1

    var item = {
        name: "",
        type: "",
        effect: ""
    }

    switch (rng) {
        case 1:
            item.name = itemTierNames[tier-1] + " Sword"
            item.type = "sword"
            item.effect = "attack " + (1 + tier*0.05)
            break

        case 2:
            item.name = itemTierNames[tier-1] + " Gloves"
            item.type = "glove"
            item.effect = "attack " + (1 + tier*0.05)
            break
        
        case 3:
            item.name = itemTierNames[tier-1] + " Ring"
            item.type = "ring"
            item.effect = "luck " + (1 + tier*0.05)
            break
    }

    var inventoryAsString = JSON.stringify(player.inventory)
    var itemAsString = JSON.stringify(item)
    
    if (!inventoryAsString.includes(itemAsString)) {
        player.inventory.push(item)
        player.newItem = true
    }
    Player.setPlayer(player)
}

function givePlayerRareItem() {
    return
}

function init() {
    updatesItemsFromJSON()
}

function setPlayer(p) {
    Player = p
}

module.exports = {
    init, rollDropItem, setPlayer
}