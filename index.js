const Hapi   = require('hapi')
const routes = require('./config/routes')

const server = new Hapi.Server()

server.connection({
  port: process.env.PORT || 8000,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

server.route(routes)

server.start(err => {
  if (err)
    throw err

  console.log('Server running at:', server.info.uri)
})
