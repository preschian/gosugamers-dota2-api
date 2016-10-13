const joi    = require('joi')
const match  = require('../controller/match')
const battle = require('../controller/battle')

module.exports = [{
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
