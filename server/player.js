var fs = require('fs')
var Helper = require("./helper")
var Enemy = require("./enemy")
// var items = require("./items")

var player

function getPlayer() {
    return player
}

function setPlayer(p) {
    player = p
}

function getPlayerFromJSON() {
    fs.readFile("server/static/player.json" , (err, data) => {
        if (err) { console.error(err) }
        player = JSON.parse(data).player
    })
}

function updatePlayerJSON() {
    fs.writeFile('server/static/player.json', JSON.stringify(player), (err) => {
        if (err) throw err;
    });
}

function checkForLevelUp() {
    if (player.xp >= player.xpUntilNextLevel) {
        player.xp -= player.xpUntilNextLevel
        player.level += 1
        player.ap += 1
        player.xpUntilNextLevel = getXPUntilNextLevel(player.level)
    }
}

function checkForStageAdvance() {
    if (player.enemiesLeftOnStage <= 0) {
        player.stage += 1
        player.enemiesLeftOnStage = 5
    }
}

function applyPlayerEquipment() {
    player.equipment.forEach((item) => {
        var stat = item.effect.split(" ")[0]
        var mult = Number(item.effect.split(" ")[1])

        if(stat == "luck") { player.stats.luck = Math.floor(player.stats.luck * mult) }
        if(stat == "attack") { player.stats.attack = Math.floor(player.stats.attack * mult) }
    })
}

function givePlayerXP() {
    player.xp += Math.floor(getXPUntilNextLevel(player.stage) / 5)
    player.enemiesLeftOnStage -= 1
    server.addXPMessage({
        x: Math.floor(Math.random() * 120) + 620,
        y: 200,
        text: helper.formatNumber(Math.floor(getXPUntilNextLevel(player.stage) / 5))
    })
}

function getXPUntilNextLevel(level) {
    return Math.round( 0.04 * (Math.pow(level, 3)) + 0.8 * (level*level) + 2 * level)
}

function dealDamage(multiplier) {
    var enemy = Enemy.getEnemy()
    var damage = player.attack.stats * player.equipmentEffects.attackMultiplier * multiplier
    enemy.health -= damage
    Enemy.setEnemy(enemy)
}

function levelUpStat(stat) {
    player.ap -= 1
    if (stat == "luck") { player.stats.luck += 1}
    if (stat == "attack") { player.stats.attack += 1}  
}

function init() {
    getPlayerFromJSON()
    applyPlayerEquipment()
}

module.exports = {
    getPlayer, setPlayer, givePlayerXP, levelUpStat, dealDamage, updatePlayerJSON, init
}

console.log(Helper.formatNumber(1000))