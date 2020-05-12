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
    var stage = player.stage, luck = player.luck

    var rng = Math.floor(Math.random() * 10) + 1
    rng += luck/8
    rng -= stage/60

    if (rng >= 9.5) {
        givePlayerRareItem()
    }
    else if (rng >= 8) {
        givePlayerNormalItem()
    }
}

function givePlayerNormalItem() {
    var player = Player.getPlayer()
    var rng = Math.floor(Math.random() * 3) + 1
    var tier = Math.floor(player.stage-1 / 5) + 1

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

        case 2:
            item.name = itemTierNames[tier-1] + " Gloves"
            item.type = "gloves"
            item.effect = "attack " + (1 + tier*0.05)
        
        case 3:
            item.name = itemTierNames[tier-1] + " Ring"
            item.type = "ring"
            item.effect = "luck " + (1 + tier*0.05)
    }

    player.inventory.push(item)
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
    init, rollDropItem, Player: "", setPlayer, itemTierNames: ""
}