const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

// var fs = require('fs');
// var Bus = require('./models').Bus
// var Driver = require('./models').Driver

const app = express()
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/base', {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
   if (err) throw err;
   // fs.readFile('server/db_buses.txt', 'utf8', function(err, contents) {
   //    contents.split('\n').forEach((value) => {
   //       let data = value.split(',')
   //       let document = { busnumber: data[0], mark: data[1], color: data[2], capacity: data[3] }
   //       let model = new Bus(document)
   //       model.save()
   //    })
   // })
   // fs.readFile('server/db_drivers.txt', 'utf8', function(err, contents) {
   //    contents.split('\n').forEach((value) => {
   //       let data = value.split(';')

   //       let oldGraphic = JSON.parse(data[3])
   //       let newGraphic = { date: oldGraphic.startDate.substr(0,10), items: oldGraphic.graphicItems.map((value) => ({ status: value.Status, days: ''+value.NumberOfDays }))}
         
   //       Bus.findOne({busnumber: data[2]}, (err, res) => {
   //          let document = { tabnumber: data[0], name: data[1], bus: res._id, graphic: newGraphic }
   //          let model = new Driver(document)
   //          model.save()
   //       })
   //    })
   // })
});

app.use(cookieParser())
app.use(bodyParser.json())

require('./routes')(app)

module.exports = app