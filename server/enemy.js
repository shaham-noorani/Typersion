var Items = require("./items")

var enemy
var Player

function checkIfEnemyIsDead() {
    if (!enemy) { return }
    if (enemy.health <= 0) {
        spawnEnemy()
        Player.givePlayerXP()
        Items.rollDropItem()
        checkForBoss()
    }
}

function spawnEnemy() {
    enemy.health = calcEnemyHealth()
    enemy.maxHealth = enemy.health
    enemy.boss.isBoss = false
    enemy.boss.timeLeft = 0
}

function checkForBoss() {
    if (Player.getPlayer().stage % 5 == 0 && Player.getPlayer().enemiesLeftOnStage == 1) {
       spawnBoss()
    }
}

function spawnBoss() {
    enemy.health = calcEnemyHealth() * 2
    enemy.maxHealth = enemy.health
    enemy.boss.isBoss = true
    enemy.boss.spawnTime = new Date()
    enemy.boss.timeLeft = 10
}

function getEnemy() {
    return enemy
}

function setEnemy(e) {
    enemy = e
}

function calcEnemyHealth() {
    var player = Player.getPlayer()
    var stage = player.stage
    return Math.round((stage+20)/60 * (0.8 * stage) * 5.2)
}

function completeChecks() {
    if (enemy) {
        checkIfEnemyIsDead()
        if (enemy.boss.isBoss) updateBossTimer()
    }
}

function setPlayer(p) {
    Player = p
}

function init() {
}

function updateBossTimer() {
    var now = new Date()
    enemy.boss.timeLeft = 10 - (now - Date.parse(enemy.boss.spawnTime)) / 1000
    if (enemy.boss.timeLeft <= 0) {
        enemy.boss.isBoss = false
        Player.defeatedByBoss()
    }
}

module.exports = {
    init, getEnemy, setEnemy, enemy: "", Player: "", completeChecks, setPlayer, spawnEnemy, spawnBoss
}