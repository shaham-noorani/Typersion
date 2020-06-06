var canvas = document.getElementById("game")
var context = canvas.getContext("2d")

var mouseX = 0
var mouseY = 0
var click = false

var currentScreen
var thingsToEmit = []

var socket = io()

const quoteDisplayElement = document.getElementById("quoteDisplay")
const quoteInputElement = document.getElementById("quoteInput")
const WPMElement = document.getElementById('WPM')

canvas.addEventListener('click', function(evt) {  
    click = true
})

quoteInputElement.addEventListener('input', () => {
    if (!(currentScreen == "goOut" || currentScreen == "freePlay")) {
        return
    }

    var quoteArray = quoteDisplayElement.querySelectorAll('span')
    var playerInputArray = quoteInputElement.value.split('')

    if (playerInputArray[0] == " ") {
        quoteInputElement.value = ""
        playerInputArray = ""
    }
    var correct = true
    
    // checks player input to see if quote is typed correctly
    quoteArray.forEach((charSpan, index) => {
        var char = playerInputArray[index]
        if (char == null) {
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
            correct = false
        } else if (char == charSpan.innerText) {
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
        }
        else {
            charSpan.classList.add('incorrect')
            charSpan.classList.remove('correct')
            correct = false
        }
    })
    
    if (correct && playerInputArray.length > 0)
    {
        if (currentScreen == "goOut") {
            createMegaSlash()
        }

        totalTypedWords += getTypedWords()
        getRandomQuote()
    }
})

function setMouseXY(event) {
    var rect = canvas.getBoundingClientRect(),
    scaleX = canvas.width / rect.width,    
    scaleY = canvas.height / rect.height

    mouseX = (event.clientX - rect.x) * scaleX
    mouseY = (event.clientY - rect.y) * scaleY
}

var quotes = ""
var lastRan
function getRandomQuote() {
    quoteInputElement.value = ""
    var ran = Math.floor(Math.random() * quotes.length) + 1

    if (currentScreen == "goOut") {
        lastShot = 0
        var stage = getPlayer().stage, luck = getPlayer().stats.luck * getPlayer().equipmentEffects.luckMultiplier
        var count = 0
        while (true) {
            ran = Math.floor(stage - (Math.floor(Math.random() * 20) * -1 + 10) - luck)

            if (ran < 0) { ran = 0 }
            if (ran >= quotes.length) { ran = quotes.length - 1 }

            if (ran !== lastRan) {
                lastRan = ran
                break
            }
            count++
            if (count == 5) {
                break
            }
        }
    }
    var quote = quotes[ran].quote

    // creates an array of spans that makeup the quote
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        quoteDisplayElement.appendChild(charSpan)
    });
}

let startTime 
var totalTypedWords
function startAndRunTimer() {
    WPMElement.innerText = 0
    startTime = new Date()
    totalTypedWords = 0

    // updates WPM every 1/10 sec.
    setInterval(() => {
        if (elapsedTime() != 0) {
            WPMElement.innerText = 
                Math.floor((totalTypedWords + getTypedWords()) / elapsedTime() * 60)
        }
    }, 100)
}

function resetWPM() {
    getRandomQuote()
    startAndRunTimer()
}

function elapsedTime() {
    return Math.floor((new Date - startTime) / 1000)
}

function getTypedWords() {
    var words = 0
    var playerInputArray = quoteInputElement.value.split(" ")
    playerInputArray.forEach((word) => {
        if (word != "") {
            words++
        }
    })
    return words
}

function backToTitle() {
    // resets styling to title config.
    canvas.style.display = "flex"
    WPMElement.style.display = "none"
    document.getElementById("resetWPMButton").style.display = "none"
    document.getElementById("backButton").style.display = "none"
    quoteDisplayElement.innerHTML = ''
    quoteInputElement.value = ""
    quoteInputElement.readOnly = true
    document.getElementById("quoteContainer").classList = "quote-container"

    currentScreen = "title"
    title()
}

var adventureButtonColor = "rgb(200, 200, 200)"
var freePlayButtonColor = "rgb(200, 200, 200)"

var w, h
function title() {
    if (currentScreen == "title") {
        requestAnimationFrame(title)
    }
    w = canvas.width, h = canvas.height

    context.clearRect(0, 0, canvas.width, canvas.height)

    // create adventure and freeplay button boxes
    context.beginPath()
    context.fillStyle = adventureButtonColor
    context.rect(w * 0.28, h * 0.5, w * 0.2, h * 0.1)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = freePlayButtonColor
    context.rect(w * 0.58, h * 0.5, w * 0.2, h * 0.1)
    context.fill()
    context.closePath()

    // write title text + text for both buttons
    context.beginPath()
    context.fillStyle = "rgb(40, 70, 120)"
    context.font = "normal 6vh Lato" //40px
    context.fillText("Typersion", w * 0.43, h * 0.3)
    context.fillStyle = "rgb(100, 130, 180)"
    context.font = "normal 20px Lato"
    context.fillText("Adventure", w * 0.32, h * 0.57)
    context.fillText("Freeplay", w * 0.64, h * 0.57)
    context.closePath()

    // check if freeplay button is being hovered over
    if (mouseX > w * 0.58 && mouseX < w * 0.78 && mouseY > h * 0.5 & mouseY < h * 0.6) {
        freePlayButtonColor = "rgb(255, 255, 255)"

        if (click) {
            freePlayButtonColor = "rgb(200, 200, 200)"
            currentScreen = "freePlay"
            quoteInputElement.readOnly = false
            quoteInputElement.focus()
            document.getElementById("quoteContainer").classList.add("freeplay")
            freePlay()
        }
    }
    // check if adventure button is being hovered over
    else if (mouseX > w * 0.28 && mouseX < w * 0.48 && mouseY > h * 0.5 & mouseY < h * 0.6) {
        adventureButtonColor = "rgb(255, 255, 255)"
        
        if (click) {
            click = false
            adventureButtonColor = "rgb(200, 200, 200)"
            currentScreen = "adventure"
            adventure()
            
        }
    }
    else {
        freePlayButtonColor = "rgb(200, 200, 200)"
        adventureButtonColor = "rgb(200, 200, 200)"
    }
    click = false

}

var goOutButtonColor = "rgb(200, 200, 200)"
var statsButtonColor = "rgb(200, 200, 200)"
var inventoryButtonColor = "rgb(200, 200, 200)"
var backButtonColor = "rgb(200, 200, 200)"
function adventure() {
    if (currentScreen == "adventure") {
        requestAnimationFrame(adventure)
    }
    quoteDisplayElement.innerHTML = ''

    context.clearRect(0, 0, canvas.width, canvas.height)

    // create back, go out, stats, and inventory button boxes
    context.beginPath()
    context.fillStyle = backButtonColor
    context.rect(80, 20, 70, 30)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = goOutButtonColor
    context.rect(80, 220, 150, 40)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = statsButtonColor
    context.rect(330, 220, 150, 40)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = inventoryButtonColor
    context.rect(580, 220, 150, 40)
    context.fill()
    context.closePath()

    // write title text + text for 4 buttons
    context.beginPath()
    context.fillStyle = "rgb(40, 70, 120)"
    context.font = "normal 40px Lato"
    context.fillText("Adventure", 320, 80)
    context.fillStyle = "rgb(100, 130, 180)"
    context.font = "normal 20px Lato"
    context.fillText("Go out", 120, 250)
    context.fillText("Stats", 380, 250)
    context.fillText("Inventory", 610, 250)
    context.font = "normal 15px Lato"
    context.fillText("Back", 105, 40)
    context.closePath()

    // check if back button is being hovered over
    if (mouseX > 80 && mouseX < 80 + 70 && mouseY > 20 & mouseY < 20 + 40) {
        backButtonColor = "rgb(255, 255, 255)" 

        if (click) {
            currentScreen = "title"
            title()
        }
    }
    // check if go out button is being hovered over
    else if (mouseX > 80 && mouseX < 80 + 150 && mouseY > 220 & mouseY < 220 + 40) {
        goOutButtonColor = "rgb(255, 255, 255)"

        if (click) {
            click = false
            currentScreen = "goOut"
            quoteInputElement.readOnly = false
            quoteInputElement.focus()
            goOut()
        }
    }
    // check if stats button is being hovered over
    else if (mouseX > 330 && mouseX < 330 + 150 && mouseY > 220 & mouseY < 220 + 40) {
        statsButtonColor = "rgb(255, 255, 255)"
        
        if (click) {
        }
    }
    // check if inventory button is being hovered over
    else if (mouseX > 580 && mouseX < 580 + 150 && mouseY > 220 & mouseY < 220 + 40) {
        inventoryButtonColor = "rgb(255, 255, 255)"
        
        if (click) {
        }
    }
    else {
        goOutButtonColor = "rgb(200, 200, 200)"
        statsButtonColor = "rgb(200, 200, 200)"
        inventoryButtonColor = "rgb(200, 200, 200)"
        backButtonColor = "rgb(200, 200, 200)"
    }
    click = false
}

var backButtonColor = "rgb(200, 200, 200)"
function goOut() {
    if (currentScreen == "goOut") {
        requestAnimationFrame(goOut)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)

    thingsToEmit.forEach((item, i) => {
        var item = item.split(" ")
        if (item[0] == "playerLevelUp") {
            socket.emit("playerLevelUp", item[1])
            thingsToEmit.splice(i, 1)
        }
        else if (item[0] == "dealDamage") {
            socket.emit("dealDamage", Number(item[1]))
            thingsToEmit.splice(i, 1)
        }
    })

    checkForNewItems()

    drawPlayer()
    drawEnemy()
    drawSlashes()
    drawEnemyHealthBar()
    if (getEnemy().boss.isBoss) { drawBossTimer() }
    if (getPlayer().isStuckOnBoss) { drawFightBossButton() }
    drawStageText()
    promptUpdateStats()
    drawDamageMessages()
    drawXPMessages()
    drawNewItemMessages()
    drawPlayerXPBar()

    if (!quoteDisplayElement.innerText) {
        getRandomQuote()
    }

    context.beginPath()
    context.fillStyle = backButtonColor
    context.rect(60, 20, 70, 30)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = "rgb(100, 130, 180)"
    context.font = "normal 15px Lato"
    context.fillText("Back", 80, 40)
    context.closePath()

    if (mouseX > 60 && mouseX < 60 + 70 && mouseY > 20 & mouseY < 20 + 30) {
        backButtonColor = "rgb(255, 255, 255)" 

        if (click) {
            currentScreen = "adventure"
            quoteDisplayElement.innerHTML = ''
            click = false
            adventure()
        }
    }
    else {
        backButtonColor = "rgb(200, 200, 200)"
    }
    click = false
}

playerImg = new Image(200, 80)
playerImg.src = "static/player.png"
function drawPlayer() {
    context.drawImage(playerImg, 100, 220)
}

enemyImg = new Image(200, 80)
enemyImg.src = "static/cyclops.png"
bossImg = new Image(200, 80)
bossImg.src = "static/boss.png"
function drawEnemy() {
    if (getEnemy().boss.isBoss) {
        context.drawImage(bossImg, 650, 220)
    } else { 
        context.drawImage(enemyImg, 650, 220)
    }
}

function drawEnemyHealthBar() {
    var health = getEnemy().health, maxHealth = getEnemy().maxHealth

    context.beginPath()
    context.fillStyle = "rgb(100, 130, 180, 0.8)"
    context.rect(610, 110, 160, 60)
    context.fill()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = "rgb(200, 0, 0)"
    context.rect(620, 180, 140 * (health / maxHealth), 20)
    context.fill()

    context.fillStyle = "rgb(200, 0, 0, 0.2)"
    context.rect(620, 180, 140, 20)
    context.fill()

    context.fillStyle = "rgb(0, 0, 0)"
    context.font = "normal 15px Lato"
    context.fillText("Health: " + health + "/" + maxHealth, 620, 155)
    context.closePath()
}

var timeBossSpawnedAt
function drawBossTimer() {
    var enemy = getEnemy()

    if (enemy.boss.timeLeft <= 0) {
        enemy.boss.timeLeft = 10.0
        console.log("spawnboss from client")
        timeBossSpawnedAt = new Date()
    }

    var timeElapsed = (new Date - timeBossSpawnedAt) / 1000

    enemy.boss.timeLeft = 10 - timeElapsed 
    setEnemy(enemy)

    if (timeElapsed >= 10) {
        thingsToEmit.push("bossDefeatedPlayer")
        return
    }

    context.beginPath()
    context.fillStyle = "rgb(200, 0, 0)"
    context.rect(225, 40, 400 * ((10 - timeElapsed) / 10), 20)
    context.fill()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = "rgb(200, 0, 0, 0.2)"
    context.rect(225, 40, 400, 20)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = "rgb(0, 0, 0)"
    context.font = "normal 25px Lato"
    context.fillText("Time Left: " + (10 - timeElapsed).toFixed(1), 350, 30)
    context.closePath()

}

var fightBossButtonColor = "rgb(0, 0, 0)"
function drawFightBossButton() {
    context.beginPath()
    context.fillStyle = fightBossButtonColor
    context.rect(645, 60, 120, 30)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = "rgb(140, 0, 0)"
    context.font = "bold 22px Lato"
    context.fillText("Fight Boss", 655, 83)
    context.closePath()

    if (mouseX > 645 && mouseX < 645 + 120 && mouseY > 60 & mouseY < 60 + 30) {
        fightBossButtonColor = "rgb(40, 40, 40)" 

        if (click) {
            thingsToEmit.push("spawnBoss")
        }
    }
    else {
        fightBossButtonColor = "rgb(0, 0, 0)"
    }
}

function drawPlayerXPBar() {
    var xp = getPlayer().xp, xpUntilNextLevel = getPlayer().xpUntilNextLevel, level = getPlayer().level

    context.beginPath()
    context.fillStyle = "rgb(80, 110, 160, 0.8)"
    context.rect(260, 290, 300, 60)
    context.fill()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = "rgb(66, 155, 245)"
    context.rect(405, 320, 140 * (xp / xpUntilNextLevel), 20)
    context.fill()

    context.fillStyle = "rgb(66, 155, 245, 0.6)"
    context.rect(405, 320, 140, 20)
    context.fill()

    context.fillStyle = "rgb(0, 0, 0)"
    context.font = "normal 15px Lato"
    context.fillText("XP: " + xp + "/" + xpUntilNextLevel, 270, 335)
    context.fillText("Lvl: " + level, 270, 312)
    context.closePath()

}

function drawStageText() {
    var stage = getPlayer().stage
    var enemiesLeftString = getPlayer().isStuckOnBoss ? "" : getPlayer().enemiesLeftOnStage + "/5"

    context.beginPath()
    context.fillStyle = "rgb(0, 0, 0)"
    context.font = "normal 20px Lato"
    context.fillText("Stage: " + stage, 620, 130)
    context.fillText(enemiesLeftString, 720, 130)
    context.closePath()

}

function promptUpdateStats() {
    if (getPlayer().ap > 0) {
        context.beginPath()
        context.fillStyle = "rgb(255, 215, 0, 0.6)"
        context.rect(90, 90, 150, 100)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = "rgb(255, 255, 255)"
        context.rect(200, 125, 30, 20)
        context.rect(200, 160, 30, 20)
        context.fill()
        context.closePath()

        context.beginPath()
        context.fillStyle = "rgb(0, 0, 0)"
        context.font = "normal 20px Lato"
        context.fillText("AP: " + getPlayer().ap, 100, 115)
        context.fillText("ATK: " + getPlayer().stats.attack, 100, 145)
        context.fillText("LUK: " + getPlayer().stats.luck, 100, 175)
        context.fillText("+", 210, 142)
        context.fillText("+", 210, 177)
        context.closePath()

        if (mouseX > 200 && mouseX < 230 && mouseY > 125 && mouseY < 145 && click) {
            thingsToEmit.push("levelUpPlayer attack")
        }
        else if (mouseX > 200 && mouseX < 230 && mouseY > 160 && mouseY < 180 && click) {
            thingsToEmit.push("levelUpPlayer luck")
        }
    }
}

var playerSlashes = []
var slashImg = new Image(150, 220)
slashImg.src = "static/slash.png"
var megaSlashImg = new Image(150, 320)
megaSlashImg.src = "static/megaSlash.png"
function createSlash() {
    var slash = {
        img: slashImg,
        x: 150,
        y: 220
    }
    playerSlashes.push(slash)
}

function createMegaSlash() {
    var slash = {
        img: megaSlashImg,
        x: 150,
        y: 180,
        megaSlash: true
    }
    playerSlashes.push(slash)
}

function drawSlashes() {
    playerSlashes.forEach((slash, i) => {
        context.drawImage(slash.img, slash.x, slash.y)
        slash.x += 20
        if (slash.x > 600) {
            playerSlashes.splice(i, 1)

            if (slash.megaSlash) {
                thingsToEmit.push("dealDamage 3")
                createDamageMessage(3)
            }
            else {
                thingsToEmit.push("dealDamage 1")
                createDamageMessage(1)
            }
        }
    })
} 

var damageMessages = []
function createDamageMessage(multiplier) {
    damageMessages.push({
        x: Math.floor(Math.random() * 120) + 620,
        y: 200,
        text: formatNumber(getPlayer().stats.attack * multiplier)
    })
}

function formatNumber(val) {
    var result = val
    if (val >= 1000000000) {
        result = (Math.floor(val / 10000000) / 100).toFixed(2) + "B"
    }
    else if (val >= 1000000) {
        result = (Math.floor(val / 10000) / 100).toFixed(2) + "M"
    }
    else if (val >= 1000) {
        result = (Math.floor(val / 10) / 100).toFixed(2) + "K"
    }
    return result
}

var damageMessages = []
function drawDamageMessages() {
    context.beginPath()
    context.font = "normal 20px Lato"
    context.fillStyle = "rgb(240, 0, 0, 0.6)"
    damageMessages.forEach((msg, i) => {
        context.fillText(msg.text, msg.x, msg.y)
        msg.y += 1
        if (msg.y > canvas.height + 50) { damageMessages.splice(i, 1) }
    })
}

var xpMessages = []
function createXPMessage(xp) {
    xpMessages.push({
        x: Math.floor(Math.random() * 120) + 620,
        y: 200,
        text: xp
    })
}

function drawXPMessages() {
    context.beginPath()
    context.font = "normal 30px Lato"
    context.fillStyle = "rgb(0, 0, 200, 0.6)"
    xpMessages.forEach((msg, i) => {
        context.fillText(msg.text, msg.x, msg.y)
        msg.y += 1
        if (msg.y > canvas.height + 50) { xpMessages.splice(i, 1) }
    })
}

function checkForNewItems() {
    if (getPlayer().newItem) {
        createNewItemMessage()
        var player = getPlayer(); player.newItem = false; setPlayer(player)
    }
}

var newItemMessages = []
function createNewItemMessage() {
    newItemMessages.push({
        x: Math.floor(Math.random() * 20) + 620,
        y: 200,
        text: getPlayer().inventory[getPlayer().inventory.length - 1].name
    })
}

function drawNewItemMessages() {
    context.beginPath()
    context.font = "normal 20px Lato"
    context.fillStyle = "rgb(255, 190, 0)"
    newItemMessages.forEach((msg, i) => {
        context.fillText(msg.text, msg.x, msg.y)
        msg.y += 1
        if (msg.y > canvas.height + 50) { newItemMessages.splice(i, 1) }
    })
}

var lastShot = 0
function keyPressed(event)
{
    switch(event.keyCode)
    {
        case 32:
        // Spacebar
            if (currentScreen == "goOut") {
                var quoteArray = quoteDisplayElement.querySelectorAll('span')
                var playerInputArray = quoteInputElement.value.split('')
                shoot = true
                for (var i = playerInputArray.length-1; i >= 0; i--)
                {
                    if (i != quoteArray.length-1 && i == playerInputArray.length-1) { //first iteration
                        if (quoteArray[i+1].innerText != " ") {
                            shoot = false
                        }
                    }
                    if (playerInputArray[i] != quoteArray[i].innerText) {
                        shoot = false
                    }
                }
                if (shoot && playerInputArray.length > 0 && lastShot < playerInputArray.length) { 
                    createSlash()
                    lastShot = playerInputArray.length
                }
            }
            break
    }
}

document.addEventListener('keydown', keyPressed)

function freePlay() {
    canvas.style.display = "none"
    WPMElement.style.display = "flex"
    document.getElementById("resetWPMButton").style.display = "block"
    document.getElementById("backButton").style.display = "block"

    getRandomQuote()
    startAndRunTimer()
}

function init() {

    recieveDataFromServer()

    setInterval(() => {
        sendDataToServer()
    }, 1000 / 600)

    document.getElementById("resetWPMButton").style.display = "none"
    document.getElementById("backButton").style.display = "none"
    currentScreen = "title"
    quoteInputElement.readOnly = true

    title()
}

function getPlayer() {
    var result = localStorage.getItem("player")
    if (!result || result == "null" || result == null) {
        return {
            level: 1,
            xp: 0,
            xpUntilNextLevel: 3,
            ap: 0,
            stats: {
                attack:1, luck:1
            },
            equipmentEffects: {
                attackMultiplier: 1, luckMultiplier: 1
            }, 
            stage: 1,
            enemiesLeftOnStage: 5,
            inventory: [],
            equipment: [],
            isStuckOnBoss: false,
            newItem: false
        }
    }
    try {
        result = JSON.parse(result)
    } catch (error) {
        console.error(error)

        result = {
            level: 1,
            xp: 0,
            xpUntilNextLevel: 3,
            ap: 0,
            stats: {
                attack: 1, luck: 0
            },
            equipmentEffects: {
                attackMultiplier: 1, luckMultiplier: 1
            }, 
            stage: 1,
            enemiesLeftOnStage: 5,
            inventory: [],
            equipment: [],
            isStuckOnBoss: false,
            newItem: false
        }
    } 
    return result
}

function setPlayer(player) {
    localStorage.setItem("player", JSON.stringify(player))
}

function getEnemy() {
    var result = localStorage.getItem("enemy")
    if (!result || result == "null" || result == null) { return {
        health: 5,
        maxHealth: 5,
        boss: {
            isBoss: false,
            timeLeft: 0
        }
    } }
    try {
        result = JSON.parse(result)
    } catch (error) {
        console.error(error)
        
        result = {
            health: 5,
            maxHealth: 5,
            boss: {
                isBoss: false,
                timeLeft: 0
            }
        }
    }
    return result
}

function setEnemy(enemy) {
    localStorage.setItem("enemy", JSON.stringify(enemy))
}

function recieveDataFromServer() {
    if (quotes) { return }
    socket.on('quotes', (data) => {
        quotes = data
    });
}

function sendDataToServer() {
    thingsToEmit.forEach((item, i) => {
        var items = item.split(" ")
        if (items[0] == "levelUpPlayer") {
            thingsToEmit.splice(i, 1)
            socket.emit("levelUpPlayer", items[1], function(data) {
                setPlayer(data.player)
            })
        }
        else if (items[0] == "dealDamage") {
            thingsToEmit.splice(i, 1)
            var oldXp = getPlayer().xp, oldXpUntilNextLevel = getPlayer().xpUntilNextLevel
            socket.emit("dealDamage", Number(items[1]), function(data) {
                setEnemy(data.enemy)
                setPlayer(data.player)
                if (getEnemy().health == getEnemy().maxHealth) {
                    var xp = getPlayer().xp - oldXp
                    if (xp <= 0) {
                        xp = (oldXpUntilNextLevel - oldXp) + getPlayer().xp
                    }
                    createXPMessage(xp)
                }
            })
        }
        else if (items[0] == "bossDefeatedPlayer") {
            thingsToEmit.splice(i, 1)
            socket.emit("bossDefeatedPlayer", function(data) {
                setEnemy(data.enemy)
                setPlayer(data.player)
            })
        }
        else if (items[0] == "spawnBoss") {
            thingsToEmit.splice(i, 1)
            socket.emit("spawnBoss", function(data) {
                setEnemy(data.enemy)
                setPlayer(data.player)
            })
        }
    })
    
    socket.emit("player", getPlayer())
    socket.emit("enemy", getEnemy())
}

init()