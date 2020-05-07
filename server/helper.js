var fs = require("fs")
var path = require('path')

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

function readQuotesJSON() {
    fs.readFile("server/static/quotes.json" , (err, data) => {
        if (err) { console.error(err) }
            quotes = JSON.parse(data).quotes
            return quotes
        })
}

function init() {
    readQuotesJSON()
}

function getQuotes() {
    return quotes
}

module.exports = {
    formatNumber, readQuotesJSON, quotes: readQuotesJSON(), init, getQuotes
}