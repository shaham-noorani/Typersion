var canvas = document.getElementById("game")
var context = canvas.getContext("2d")

var mouseX = 0
var mouseY = 0
var click = false

var currentScreen

const quoteDisplayElement = document.getElementById("quoteDisplay")
const quoteInputElement = document.getElementById("quoteInput")
const WPMElement = document.getElementById('WPM')

canvas.addEventListener('click', function(evt) {  
    click = true
})

quoteInputElement.addEventListener('input', () => {
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
    
    if (correct)
    {
        if (currentScreen == "goOut") {
            createMegaSlash()
        }

        totalTypedWords += getTypedWords()
        getRandomQuote()
    }
})

function setMouseXY(event) {
    mouseX = event.clientX - 320 + mouseXAdditional
    mouseY = event.clientY - 127 + mouseYAdditional
}

var quotes = ""
function getRandomQuote() {
    quoteInputElement.value = ""
    var ran = Math.floor(Math.random() * quotes.length) + 1

    if (currentScreen == "goOut") {
        lastShot = 0
        var stage = getPlayer().stage, luck = getPlayer().luck
        var ran = Math.floor(stage - (Math.floor(Math.random() * 20) * -1 + 10) - luck)

        if (ran < 0) { ran = 0 }
        if (ran >= quotes.length) { ran = quotes.length - 1 }
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
                Math.floor((totalTypedWords + getTypedWords()) / getTimerTime() * 60)
        }
    }, 100)
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

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");

    xobj.open('GET', 'static/quotes.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}

function backToTitle() {

    // resets styling to title config.
    canvas.style.display = "flex"
    WPMElement.style.display = "none"
    document.getElementById("quoteContainer").style.bottom = "1rem"
    document.getElementById("resetWPMButton").style.display = "none"
    document.getElementById("backButton").style.display = "none"
    quoteDisplayElement.innerHTML = ''

    currentScreen = "title"
    title()
}

var adventureButtonColor = "rgb(200, 200, 200)"
var freePlayButtonColor = "rgb(200, 200, 200)"
function title() {
    if (currentScreen == "title") {
        requestAnimationFrame(title)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)

    // create adventure and freeplay button boxes
    context.beginPath()
    context.fillStyle = adventureButtonColor
    context.rect(180, 220, 150, 40)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = freePlayButtonColor
    context.rect(480, 220, 150, 40)
    context.fill()
    context.closePath()

    // write title text + text for both buttons
    context.beginPath()
    context.fillStyle = "rgb(40, 70, 120)"
    context.font = "normal 40px Lato"
    context.fillText("Typersion", 320, 80)
    context.fillStyle = "rgb(100, 130, 180)"
    context.font = "normal 20px Lato"
    context.fillText("Adventure", 210, 250)
    context.fillText("Freeplay", 520, 250)
    context.closePath()

    // check if freeplay button is being hovered over
    if (mouseX > 480 && mouseX < 480 + 150 && mouseY > 220 & mouseY < 220 + 40) {
        freePlayButtonColor = "rgb(255, 255, 255)"

        if (click) {
            freePlayButtonColor = "rgb(200, 200, 200)"
            currentScreen = "freePlay"
            freePlay()
        }
    }
    // check if adventure button is being hovered over
    else if (mouseX > 180 && mouseX < 180 + 150 && mouseY > 220 & mouseY < 220 + 40) {
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
var numberOfCompletedQuotes = -1
function goOut() {
    if (currentScreen == "goOut") {
        requestAnimationFrame(goOut)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)

    drawPlayer()
    drawEnemy()
    drawSlashes()
    handlePlayerObj()
    handleEnemyObj()
    drawEnemyHealthBar()
    drawStageText()
    promptUpdateStats()
    indicateDamage()
    indicateXP()
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

function handlePlayerObj() {
    var player = getPlayer()
    var updatePlayer = false

    if (player == null || player == "undefined") {
        player = {
            level: 1,
            xp: 0,
            xpUntilNextLevel: getXPUntilNextLevel(1),
            ap: 0,
            attack: 1,
            luck: 1,
            stage: 1,
            enemiesLeftOnStage: 5,
            inventory: []
        }
        updatePlayer = true
    }

    // check for level up
    if (player.xp >= player.xpUntilNextLevel) {
        player.xp -= player.xpUntilNextLevel
        player.level += 1
        player.ap += 1
        player.xpUntilNextLevel = getXPUntilNextLevel(player.level)
        updatePlayer = true
    }

    // check for increment stage
    if (player.enemiesLeftOnStage <= 0) {
        player.stage += 1
        player.enemiesLeftOnStage = 5
        updatePlayer = true
    }

    if (setPlayer) { setPlayer(player) }
}

function handleEnemyObj() {
    var enemy = getEnemy()
    var updateEnemy = false

    if (enemy == null || enemy == "undefined") {
        enemy = {
            health: 5,
        }
        updateEnemy = true
    }

    if (enemy.health <= 0) {
        enemy.health = calcEnemyHealth()
        updateEnemy = true
        givePlayerXP()
    }

    if (updateEnemy) { setEnemy(enemy) }
}

function getPlayer() {
    var result = localStorage.getItem("player")
    try {
        result = JSON.parse(result)
    } catch (error) {
        console.error(error)
    } 
    return result
}

function setPlayer(player) {
    localStorage.setItem("player", JSON.stringify(player))
}

function getEnemy() {
    return JSON.parse(localStorage.getItem("enemy"))
}

function setEnemy(enemy) {
    localStorage.setItem("enemy", JSON.stringify(enemy))
}

function calcEnemyHealth() {
    var stage = getPlayer().stage
    return Math.floor((stage * stage) / 2) + 5
}

var xpMessages = []
function givePlayerXP() {
    var player = getPlayer()
    player.xp += Math.floor(getXPUntilNextLevel(player.stage) / 5)
    player.enemiesLeftOnStage -= 1
    xpMessages.push({
        x: Math.floor(Math.random() * 120) + 620,
        y: 200,
        text: formatNumber(Math.floor(getXPUntilNextLevel(player.stage) / 5))
    })
    setPlayer(player)
}

function getXPUntilNextLevel(level) {
    return Math.round( 0.04 * (Math.pow(level, 3)) + 0.8 * (level*level) + 2 * level)
}

enemyImg = new Image(200, 80)
enemyImg.src = "static/cyclops.png"
function drawEnemy() {
    context.drawImage(enemyImg, 650, 220)
}

function drawEnemyHealthBar() {
    var health = getEnemy().health

    context.beginPath()
    context.fillStyle = "rgb(100, 130, 180, 0.8)"
    context.rect(610, 110, 160, 60)
    context.fill()
    context.closePath()
    
    context.beginPath()
    context.fillStyle = "rgb(200, 0, 0)"
    context.rect(620, 180, 140 * (health / calcEnemyHealth()), 20)
    context.fill()

    context.fillStyle = "rgb(200, 0, 0, 0.2)"
    context.rect(620, 180, 140, 20)
    context.fill()

    context.fillStyle = "rgb(0, 0, 0)"
    context.font = "normal 15px Lato"
    context.fillText("Health: " + formatNumber(health) + "/" + formatNumber(calcEnemyHealth()), 620, 155)
    context.closePath()
}

function drawPlayerXPBar() {
    var player = getPlayer()
    var xp = Math.floor(player.xp), xpUntilNextLevel = player.xpUntilNextLevel, level = player.level

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
    context.fillText("XP: " + formatNumber(xp) + "/" + formatNumber(xpUntilNextLevel), 270, 335)
    context.fillText("Lvl: " + formatNumber(level), 270, 312)
    context.closePath()

}

function drawStageText() {
    var stage = getPlayer().stage
    var enemiesLeftString = getPlayer().enemiesLeftOnStage + "/5"

    context.beginPath()
    context.fillStyle = "rgb(0, 0, 0)"
    context.font = "normal 20px Lato"
    context.fillText("Stage: " + stage, 620, 130)
    context.fillText(enemiesLeftString, 720, 130)
    context.closePath()

}

function promptUpdateStats() {
    if (getPlayer().ap > 0) {
        var player = getPlayer()

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
        context.fillText("ATK: " + getPlayer().attack, 100, 145)
        context.fillText("LUK: " + getPlayer().luck, 100, 175)
        context.fillText("+", 210, 142)
        context.fillText("+", 210, 177)
        context.closePath()

        if (mouseX > 200 && mouseX < 230 && mouseY > 125 && mouseY < 145 && click) {
            player.attack += 1
            player.ap -= 1
        }
        else if (mouseX > 200 && mouseX < 230 && mouseY > 160 && mouseY < 180 && click) {
            player.luck += 1
            player.ap -= 1
        }
        setPlayer(player)
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
                dealDamage(3)
            }
            else {
                dealDamage(1)
            }
        }
    })
} 

var damageMessages = []
function dealDamage(multiplier) {
    var enemy = getEnemy(), player = getPlayer()
    enemy.health -= player.attack * multiplier
    setEnemy(enemy)
    damageMessages.push({
        x: Math.floor(Math.random() * 120) + 620,
        y: 200,
        text: formatNumber(player.attack * multiplier)
    })
}

function indicateDamage() {
    context.beginPath()
    context.font = "normal 20px Lato"
    context.fillStyle = "rgb(240, 0, 0, 0.6)"
    damageMessages.forEach((msg, i) => {
        context.fillText(msg.text, msg.x, msg.y)
        msg.y += 1
        if (msg.y > canvas.height + 50) { damageMessages.splice(i, 1) }
    })
}

function indicateXP() {
    context.beginPath()
    context.font = "normal 30px Lato"
    context.fillStyle = "rgb(0, 0, 200, 0.6)"
    xpMessages.forEach((msg, i) => {
        context.fillText(msg.text, msg.x, msg.y)
        msg.y += 1
        if (msg.y > canvas.height + 50) { xpMessages.splice(i, 1) }
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
    WPMElement.style.top = "5rem"
    WPMElement.style.display = "flex"
    document.getElementById("quoteContainer").style.bottom = "6rem"
    document.getElementById("resetWPMButton").style.display = "block"
    document.getElementById("backButton").style.display = "block"

    getRandomQuote()
    startAndRunTimer()
}

var mouseXAdditional = 0
var mouseYAdditional = 0
function init() {
    if (screen.height > 800) {
        canvas.classList.add("taller-screen")
        WPMElement.classList.add("taller-screen")
    }
    else {
        mouseXAdditional = 37; mouseYAdditional = 64;
    }
    document.getElementById("resetWPMButton").style.display = "none"
    document.getElementById("backButton").style.display = "none"
    currentScreen = "title"

    loadJSON((resp) =>  { var json = JSON.parse(resp); quotes = json.quotes })

    title()
}

init()