var Items = require("./items")
var fs = require("fs") 
var path = require('path')

var enemy
var Player

function checkIfEnemyIsDead() {
    if (!enemy) { return }
    if (enemy.health <= 0) {
        enemy.health = calcEnemyHealth()
        enemy.maxHealth = enemy.health
        Player.givePlayerXP()
        Items.rollDropItem()
    }
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