var Items = require("./items")
var fs = require("fs") 
var path = require('path')

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
    return Math.floor((stage * stage) / 2) + 5
}

function completeChecks() {
    checkIfEnemyIsDead()
}

function setPlayer(p) {
    Player = p
}

function init() {
}

module.exports = {
    init, getEnemy, setEnemy, enemy: "", Player: "", completeChecks, setPlayer, spawnEnemy, spawnBoss
}