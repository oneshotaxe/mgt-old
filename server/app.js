const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

var fs = require('fs');
var Bus = require('./models').Bus
var Driver = require('./models').Driver
var Route = require('./models').Route
var Way = require('./models').Way

const app = express()
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/base', {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
   if (err) throw err;
   fs.readFile('server/db.csv', 'utf8', async function(err, contents) {
      await Bus.deleteMany()
      await Driver.deleteMany()
      await Route.deleteMany()
      await Way.deleteMany()
      contents.split('\r\n').forEach(async (value) => {
         let data = value.split(';')
         let route = null,
            way = null,
            bus = null,
            driver = null
         if (data[0]) {
            route = await Route.findOne({ title: data[0] })
            if (!route) {
               route = new Route({ title: data[0] })
               await route.save()
            }
            way = await Way.findOne({ title: data[1] })
            if (!way) {
               way = new Way({ title: data[0], route: route._id })
               await way.save()
            }
         }
         if (data[2]) {
            bus = await Bus.findOne({ busnumber: data[2] })
            if (!bus) {
               bus = new Bus({ busnumber: data[2] })
               if (way) {
                  bus.way = way._id
               }
               await bus.save()
            }
         }
         if (data[5]) {
            driver = await Driver.findOne({ tabnumber: data[5] })
            if (!driver) {
               driver = new Driver({ tabnumber: data[5], name: data[3], bus: bus._id })
               await driver.save()
            }
         }
      })
   })
});

app.use(cookieParser())
app.use(bodyParser.json())

require('./routes')(app)

module.exports = app