const joi    = require('joi')
const match  = require('../controller/match')
const battle = require('../controller/battle')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    const url = `${request.connection.info.protocol}://${request.info.host + request.url.path}`
    const parse = (link) => url + link

    reply({
      basePath: url,
      path: [{
        title: 'get live matches',
        url: parse('match/live')
      }, {
        title: 'get upcoming matches',
        url: parse('match/upcoming')
      }, {
        title: 'get recent results',
        url: parse('match/recent')
      }, {
        title: 'get match detail',
        url: parse('battle'),
        query: {
          link: {
            type: 'string',
            required: true
          }
        }
      }]
    })
  }
}, {
  method: 'GET',
  path: '/match/{type}',
  handler: (request, reply) => {
    match(encodeURIComponent(request.params.type), data => reply(data))
  },
  config: {
    validate: {
      params: {
        type: ['live', 'upcoming', 'recent']
      }
    }
  }
}, {
  method: 'GET',
  path: '/battle',
  handler: (request, reply) => {
    battle(request.query.link, data => reply(data))
  },
  config: {
    validate: {
      query: {
        link: joi.string().required()
      }
    }
  }
}]
