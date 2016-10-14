const cheerio = require('cheerio')
const request = require('request')
const cachedRequest = require('cached-request')(request)
const url = require('../config/url')

cachedRequest.setCacheDirectory('./tmp/battle')

const tag = html => cheerio.load(html)

const getPick = element => {
  return tag(element)('.pick-row').map((index, elm) => {
    const player = tag(elm)('.player-name').text().trim()
    const hero = tag(elm)('.hero').attr('title')
    const image = url.link(tag(elm)('.hero').attr('src'))
    const country = tag(elm)('.flag').attr('title')

    return {
      player,
      hero,
      image,
      country
    }
  }).get()
}

const getBans = element => {
  return tag(element)('img').map((index, elm) => {
    const hero = tag(elm)(elm).attr('title')
    const image = url.link(tag(elm)(elm).attr('src'))

    return {
      hero,
      image
    }
  }).get()
}

const getDraftsDetail = element => {
  return tag(element)('.full').map((index, elm) => {
    const team = tag(elm)('.team-name').text().trim()
    const turn = tag(elm)('.pick-order').text().trim()
    const race = tag(elm)('.race-name').text().trim()
    const bans = getBans(tag(elm)('.bans').html())
    const pick = getPick(tag(elm)('.picks').html())

    return {
      team,
      turn,
      race,
      bans,
      pick
    }
  }).get()
}

const getDrafts = element => {
  const drafts = tag(element)('.lineups .lineup').map((index, elm) => {
    return {
      [`game${index + 1}`]: getDraftsDetail(tag(elm)(elm).html())
    }
  }).get()

  return {
    drafts
  }
}

const getWinner = element => {
  const winners = tag(element)('.match-game-tab').map((index, elm) => {
    return [tag(elm)('.btn-winner').attr('value') || false]
  }).get()

  return {
    winners
  }
}

const getOpponents = element => {
  const $ = tag(element)
  const opponent1 = $('.opponent1 h3 a').text()
  const opponent2 = $('.opponent2 h3 a').text()
  const score1 = $('.vs .hidden span:nth-child(1)').text()
  const score2 = $('.vs .hidden span:nth-child(2)').text()
  const date = $('.datetime').text().trim()
  const bestof = $('.bestof').text()

  return {
    opponent1,
    opponent2,
    score1,
    score2,
    date,
    bestof
  }
}

const parseJson = element => {
  return Object.assign(
    getOpponents(tag(element)('.match-heading').html()),
    getWinner(tag(element)('.matches-streams').html()),
    getDrafts(tag(element)('.draft-embed').html())
  )
}

module.exports = (link, callback) => {
  cachedRequest({
    url: url.link(link),
    ttl: 900000
  }, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const html = tag(body)('.content.full-width').html()

      callback(parseJson(html))
    } else {
      callback(error)
    }
  })
}
