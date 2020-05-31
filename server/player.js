var fs = require('fs')
var Helper = require("./helper")
var path = require('path')
// var items = require("./items")

// var player
var Enemy

function getPlayer() {
    return player
}

function setPlayer(p) {
    player = p
}

function getPlayerFromJSON() {
    fs.readFile(path.join(__dirname, "static/player.json") , (err, data) => {
        if (err) { console.error(err) }
        player = JSON.parse(data).player
        return player
    })
}

function updatePlayerJSON() {
    if (!player) { return }
    var json = {
        player: player
    }
    fs.writeFile('server/static/player.json', JSON.stringify(json), (err) => {
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
}

function getXPUntilNextLevel(level) {
    return Math.round( 0.04 * (Math.pow(level, 3)) + 0.8 * (level*level) + 2 * level)
}

function dealDamage(multiplier) {
    var enemy = Enemy.getEnemy()
    var damage = player.stats.attack * player.equipmentEffects.attackMultiplier * multiplier
    enemy.health -= damage
    Enemy.setEnemy(enemy)
}

function levelUpStat(stat) {
    player.ap -= 1
    if (stat == "luck") { player.stats.luck += 1}
    if (stat == "attack") { player.stats.attack += 1}  
}

function completeChecks() {
    if (!player) { return }
    checkForLevelUp()
    checkForStageAdvance()
}

function setEnemy(e) {
    Enemy = e
}

function init() {
    getPlayerFromJSON()
    // applyPlayerEquipment()
}

module.exports = {
    getPlayer, setPlayer, givePlayerXP, levelUpStat, 
    dealDamage, updatePlayerJSON, init, getPlayerFromJSON, 
    player: getPlayerFromJSON(), Enemy: "", completeChecks, setEnemy
}
