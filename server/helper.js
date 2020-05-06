var fs = require("fs")
var path = require('path')

var quotes = readQuotesJSON()

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
    var result
    fs.readFile(path.join(__dirname, "../client/static/quotes.json") , (err, data) => {
        if (err) { console.error(err) }
            var asJSON = JSON.parse(data).quotes
            return asJSON
            result = JSON//.stringify(asJSON)
        })
    return result
}

module.exports = {
    formatNumber, readQuotesJSON, quotes
}