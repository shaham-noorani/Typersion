var Items = require("./items")
var fs = require("fs") 
var path = require('path')

var enemy
var Player

function checkIfEnemyIsDead() {
    if (!enemy) { return }
    if (enemy.health <= 0) {
        spawnEnemy()
        checkForBoss()
        Player.givePlayerXP()
        Items.rollDropItem()
    }
}

function spawnEnemy() {
    enemy.health = calcEnemyHealth()
    enemy.maxHealth = enemy.health
    enemy.boss = false
}

function checkForBoss() {
    if (Player.getPlayer().stage % 5 == 0 && Player.getPlayer().enemiesLeftOnStage == 2) {
       spawnBoss()
    }
}

function spawnBoss() {
    enemy.health = calcEnemyHealth() * 2
    enemy.maxHealth = enemy.health
    enemy.boss = true
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
    init, getEnemy, setEnemy, enemy: "", Player: "", completeChecks, setPlayer
}