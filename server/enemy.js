var Items = require("./items")
var fs = require("fs") 

// var enemy
var Player

function getEnemyFromJSON() {
    fs.readFile("server/static/enemy.json" , (err, data) => {
        if (err) { console.error(err) }
        enemy = JSON.parse(data).enemy
      })
}

function updateEnemyJSON() {
    if (!enemy) { return }
    var json = {
        enemy: enemy
    }
    fs.writeFile('server/static/enemy.json', JSON.stringify(json), (err) => {
        if (err) throw err;
    });
}

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
    getEnemyFromJSON()
}

module.exports = {
    init, getEnemy, setEnemy, enemy: getEnemyFromJSON(), Player: "", updateEnemyJSON, completeChecks, setPlayer
}