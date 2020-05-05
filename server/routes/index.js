var express = require('express')
const jwt = require('express-jwt')

var auth = require('./auth')
var drivers = require('./drivers')
var buses = require('./buses')
var routes = require('./routes')
var ways = require('./ways')
var outfits = require('./outfits')
var templates = require('./templates')

var api = express.Router()
api.use(
  jwt({
    secret: 'dummy'
  }).unless({
    path: '/api/auth/login'
  })
)

module.exports = function(app) {
  api.use('/auth', auth)
  api.use('/drivers', drivers)
  api.use('/buses', buses)
  api.use('/routes', routes)
  api.use('/ways', ways)
  api.use('/outfits', outfits)
  api.use('/templates', templates)
  
  app.use('/api', api)
}