var fs = require("fs")
var path = require('path')

var inspirationalQuotes, southParkQuotes

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

function readInspirationalQuotesJSON() {
    fs.readFile(path.join(__dirname, "static/inspirational_quotes.json") , (err, data) => {
        if (err) { console.error(err) }
            inspirationalQuotes = JSON.parse(data).quotes
            return inspirationalQuotes
        })
}

function readSouthParkQuotesJSON() {
    fs.readFile(path.join(__dirname, "static/south_park_quotes.json") , (err, data) => {
        if (err) { console.error(err) }
            southParkQuotes = JSON.parse(data).quotes
            return southParkQuotes
        })
}

function init() {
    readInspirationalQuotesJSON()
    readSouthParkQuotesJSON()
}

function getInspirationalQuotes() {
    return inspirationalQuotes
}

function getSouthParkQuotes() {
    return southParkQuotes
}

module.exports = {
    formatNumber, readInspirationalQuotesJSON, readSouthParkQuotesJSON, quotes: readInspirationalQuotesJSON(), init, getInspirationalQuotes, getSouthParkQuotes
}