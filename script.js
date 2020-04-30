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
        totalTypedWords += getTypedWords()
        getRandomQuote()
    }
})

function setMouseXY(event) {
    mouseX = event.clientX - 320 + mouseXAdditional
    mouseY = event.clientY - 127 + mouseYAdditional
}

function getRandomQuote() {
    quoteInputElement.value = ""
    
    loadJSON(function(response) {
        var json = JSON.parse(response)
        var quotes = json.quotes
        var ran = Math.floor(Math.random() * quotes.length) + 1
        var quote = quotes[ran].quote

        quoteDisplayElement.innerHTML = ''
        quote.split('').forEach(char => {
            const charSpan = document.createElement('span')
            charSpan.innerText = char
            quoteDisplayElement.appendChild(charSpan)
        });
    })
}

let startTime 
var totalTypedWords
function startAndRunTimer() {
    WPMElement.innerText = 0
    startTime = new Date()
    totalTypedWords = 0
    setInterval(() => {
        if (getTimerTime() != 0) {
            WPMElement.innerText = 
                Math.floor((totalTypedWords + getTypedWords() - 1) / getTimerTime() * 60)
        }
    }, 100)
}

function getTimerTime() {
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

    xobj.open('GET', 'quotes.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
}

var adventureButtonColor = "rgb(200, 200, 200)"
var freePlayButtonColor = "rgb(200, 200, 200)"
function title() {
    if (currentScreen == "title") {
        requestAnimationFrame(title)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)

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

    context.beginPath()
    context.fillStyle = "rgb(40, 70, 120)"
    context.font = "normal 40px Lato"
    context.fillText("Typersion", 320, 80)
    context.fillStyle = "rgb(100, 130, 180)"
    context.font = "normal 20px Lato"
    context.fillText("Adventure", 210, 250)
    context.fillText("Freeplay", 520, 250)
    context.closePath()

    if (mouseX > 480 && mouseX < 480 + 150 && mouseY > 220 & mouseY < 220 + 40) {
        freePlayButtonColor = "rgb(255, 255, 255)"

        if (click) {
            freePlay()
            requestAnimationFrame(freePlay)
            currentScreen = "freePlay"
        }
    }
    else if (mouseX > 180 && mouseX < 180 + 150 && mouseY > 220 & mouseY < 220 + 40) {
        adventureButtonColor = "rgb(255, 255, 255)"
        
        if (click) {
            adventureMode()
            requestAnimationFrame(adventureMode)
            currentScreen = "adventure"
        }
    }
    else {
        freePlayButtonColor = "rgb(200, 200, 200)"
        adventureButtonColor = "rgb(200, 200, 200)"
    }
    click = false

}

function adventureMode() {
    if (currentScreen == "adventure") {
        requestAnimationFrame(adventureMode)
    }
    context.clearRect(0, 0, canvas.width, canvas.height)

    drawPlayer()
    drawEnemy()
    drawSlashes()
    if (!quoteDisplayElement.innerText) {
        getRandomQuote()
    }
    handlePlayerObj()
    handleEnemyObj()
    drawEnemyHealthBar()
}

function drawPlayer() {
    playerImg = new Image(200, 80)
    playerImg.src = "player.png"
    context.drawImage(playerImg, 100, 220)
}

function handlePlayerObj() {
    var player = getPlayer()
    if (player == null) {
        console.log("lmao")
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
        setPlayer(player)
    }
    if (player.xp > player.xpUntilNextLevel) {
        player.xp -= player.xpUntilNextLevel
        player.level += 1
        player.ap += 1
        player.xpUntilNextLevel = getXPUntilNextLevel(player.level)
        setPlayer(player)
    }
}

function handleEnemyObj() {
    var enemy = getEnemy()
    if (enemy == null) {
        enemy = {
            health: 5,
        }
        setEnemy(enemy)
    }
    if (enemy.health <= 0) {
        enemy.health = calcEnemyHealth()
        setEnemy(enemy)
        givePlayerXP()
    }
}

function getPlayer() {
    return JSON.parse(localStorage.getItem("player"))
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
    return Math.floor(stage / 5) * 5 + 5
}

function givePlayerXP() {
    var player = getPlayer()
    player.xp += Math.floor(player.stage / 5) * 5 + 1
    setPlayer(player)
}

function getXPUntilNextLevel(level) {
    return Math.floor((level * level) / 5) + 5
}

function drawEnemy() {
    enemyImg = new Image(200, 80)
    enemyImg.src = "cyclops.png"
    context.drawImage(enemyImg, 650, 220)
}

function drawEnemyHealthBar() {
    context.beginPath()
    context.fillStyle = "rgb(200, 0, 0)"
    context.rect(620, 180, 140 * (getEnemy().health / calcEnemyHealth()), 20)
    context.fill()
    context.closePath()
}

var playerSlashes = []
var slashImg = new Image(150, 220)
slashImg.src = "slash.png"
function createSlash() {
    var slash = {
        img: slashImg,
        x: 150,
        y: 220
    }
    playerSlashes.push(slash)
}

function drawSlashes() {
    playerSlashes.forEach((slash, i) => {
        context.drawImage(slash.img, slash.x, slash.y)
        slash.x += 20
        if (slash.x > 600) {
            dealDamage()
            playerSlashes.splice(i, 1)
        }
    })
} 

function dealDamage() {
    var enemy = getEnemy(), player = getPlayer()
    enemy.health -= player.attack
    setEnemy(enemy)
}

function keyPressed(event)
{
    switch(event.keyCode)
    {
        case 32:
        // Spacebar
            if (currentScreen == "adventure") {
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
                if (shoot && playerInputArray.length > 0) { createSlash() }
            }
            break
    }
}

document.addEventListener('keydown', keyPressed)

function freePlay() {
    canvas.style.display = "none"
    WPMElement.style.top = "5rem"
    document.getElementById("quoteContainer").style.bottom = "6rem"
    document.getElementById("resetWPMButton").style.display = "block"

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
    currentScreen = "title"
    title()
}

init()