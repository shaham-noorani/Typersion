var canvas = document.getElementById("game")
var context = canvas.getContext("2d")

const SCREEN_HEIGHT = 400
const SCREEN_WIDTH = 800

var mouseX = 0
var mouseY = 0
var click = false

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

function setMouseXY(event)
{
    mouseX = event.clientX
    mouseY = event.clientY
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
var totalTypedWords = 0
function startAndRunTimer() {
    WPMElement.innerText = 0
    startTime = new Date()
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
    return quoteInputElement.value.split(" ").length
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

function title() {
    requestAnimationFrame(title)
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.beginPath()
    context.rect(0, 0, canvas.width, canvas.height)
    context.fillStyle = "rgb(0, 0, 0)"
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = "rgb(240, 240, 240)"
    context.rect(180, 220, 150, 40)
    context.rect(480, 220, 150, 40)
    context.fill()
    context.closePath()

    context.beginPath()
    context.fillStyle = "rgb(100, 130, 180)"
    context.font = "normal 40px Lato"
    context.fillText("Typersion", 320, 80)
    context.font = "normal 20px Lato"
    context.fillText("Adventure", 210, 250)
    context.fillText("Freeplay", 520, 250)
    context.closePath()

}

function init() {
    if (screen.height > 800) {
        canvas.classList.add("taller-screen")
        WPMElement.classList.add("taller-screen")
    }
    title()
    getRandomQuote()
    startAndRunTimer()
}

init()