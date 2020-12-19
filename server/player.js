var player
var Enemy

function getPlayer() {
    return player
}

function setPlayer(p) {
    player = p
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
    var attackMultiplier = 1, luckMultiplier = 1
    player.equipment.forEach((item) => { // ex: item.effect = "luck 1.1"
        var stat = item.effect.split(" ")[0]
        var mult = Number(item.effect.split(" ")[1])

        if (stat == "luck") { luckMultiplier += mult - 1 }
        if (stat == "attack") { attackMultiplier += mult - 1 }
    })
    player.equipmentEffects = { 
        attackMultiplier: Math.round(attackMultiplier*100)/100,
        luckMultiplier: Math.round(luckMultiplier*100)/100 
    }
}

function givePlayerXP() {
    var xp = Math.floor(getXPUntilNextLevel(player.stage) / 5) + 1
    player.xp += xp
    player.xpMessagesToAdd.push(xp)
    if (!player.isStuckOnBoss) player.enemiesLeftOnStage -= 1
}

function getXPUntilNextLevel(level) {
    return Math.round( 0.01 * (level ** 3) + 0.8 * (level ** 2) + 2 * level)
}

function dealDamage(multiplier) {
    var enemy = Enemy.getEnemy()
    var damage = Math.floor(player.stats.attack * player.equipmentEffects.attackMultiplier * multiplier)
    enemy.health -= damage
    Enemy.setEnemy(enemy)
}

function equipItem(item) {
    for (var i = 0; i < player.equipment.length; i++) {
        if (player.equipment[i].type == item.type) {
            player.equipment.splice(i, 1)
            player.equipment.push(item)
            return
        }
    }
    player.equipment.push(item)
    applyPlayerEquipment()
}

function levelUpStat(stat) {
    player.ap -= 1
    if (stat == "luck") { player.stats.luck += 1}
    if (stat == "attack") { player.stats.attack += 1}  
}

function defeatedByBoss() {
    player.enemiesLeftOnStage = 2
    player.isStuckOnBoss = true
    Enemy.spawnEnemy()
}

function retryBoss() {
    player.enemiesLeftOnStage = 1
    player.isStuckOnBoss = false
    Enemy.spawnBoss()
}

function completeChecks() {
    if (!player) return 
    checkForLevelUp()
    checkForStageAdvance()
    applyPlayerEquipment()
}

function setEnemy(e) {
    Enemy = e
}

function init() {
}

module.exports = {
    getPlayer, setPlayer, givePlayerXP, levelUpStat, 
    dealDamage, init, player: "", Enemy: "", completeChecks, setEnemy, defeatedByBoss, retryBoss, equipItem
}
