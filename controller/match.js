const cheerio       = require('cheerio')
const request       = require('request')
const cachedRequest = require('cached-request')(request)
const url           = require('../config/url')

cachedRequest.setCacheDirectory('./tmp/match')

const getMatches = (element, title) => {
  const $ = cheerio.load(element)
  let text

  if (title === 'recent') {
    text = `${title} results`
  } else {
    text = `${title} matches`
  }

  const matches = $('tbody tr').map((index, element) => {
    const opponent1 = $(element).find('td:nth-child(1) .opp1 span:nth-child(1)').text()
    const opponent2 = $(element).find('td:nth-child(1) .opp2 span:nth-child(2)').text()
    const score1 = $(element).find('.type-specific .score:nth-child(1)').text() || false
    const score2 = $(element).find('.type-specific .score:nth-child(2)').text() || false
    const estimate = $(element).find('td:nth-child(2) .live-in').text().trim() || false
    const matchLink = $(element).find('a').attr('href')
    const tournamentImage = url.link($(element).find('.tournament img').attr('src'))
    const tournamentLink = $(element).find('.tournament a').attr('href')

    return {
      opponent1,
      opponent2,
      score1,
      score2,
      estimate,
      matchLink,
      tournamentImage,
      tournamentLink
    }
  }).get()

  return {
    text,
    matches: (matches.length > 0) ? matches : false
  }
}

module.exports = (type, callback) => {
  cachedRequest({
    url: url.match(),
    ttl: 900000
  }, (error, response, body) => {
    if (error) callback(error)

    const $ = cheerio.load(body)

    switch (type) {
      case 'live':
        callback(getMatches($('#col1 .box:nth-child(1)').html(), type))
        break
      case 'upcoming':
        callback(getMatches($('#col1 .box:nth-child(2)').html(), type))
        break
      case 'recent':
        callback(getMatches($('#col1 .box:nth-child(3)').html(), type))
        break
      default:
        break
    }
  })
}
