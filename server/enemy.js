var Player = require("./player.js")
var Items = require("./items")
var fs = require("fs") 


function getEnemyFromJSON() {
    fs.readFile("server/static/enemy.json" , (err, data) => {
        if (err) { console.error(err) }
        enemy = JSON.parse(data).enemy
      })
}

function updateEnemyJSON() {
    fs.writeFile('server/static/enemy.json', JSON.stringify(enemy), (err) => {
        if (err) throw err;
    });
}

function checkIfEnemyIsDead() {
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
    var stage = Player.getPlayer().stage
    return Math.floor((stage * stage) / 2) + 5
}

function completeChecks() {
    checkIfEnemyIsDead()
}

function init() {
    getEnemyFromJSON()
}

module.exports = {
    init, getEnemy, setEnemy, enemy: getEnemyFromJSON(), updateEnemyJSON, completeChecks
}