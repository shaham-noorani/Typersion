const quoteDisplayElement = document.getElementById("quoteDisplay")
const quoteInputElement = document.getElementById("quoteInput")
const WPMElement = document.getElementById('WPM')
 
quoteInputElement.addEventListener('input', () => {
    var quoteArray = quoteDisplayElement.querySelectorAll('span')
    var playerInputArray = quoteInputElement.value.split('')
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

function getRandomQuote() {
    console.log("lmao")
    quoteInputElement.value = null
    
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
function startAndRunTimer()
{
    WPMElement.innerText = 0
    startTime = new Date()
    setInterval(() => {
        if (getTimerTime != 0) {
        WPMElement.innerText = Math.floor(totalTypedWords + getTypedWords() / getTimerTime() * 60)
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

function init() {
    getRandomQuote()
    startAndRunTimer()
}

init()