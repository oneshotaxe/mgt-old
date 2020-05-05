const Outfit = require('../models').Outfit
const Driver = require('../models').Driver
const Bus = require('../models').Bus

var express = require('express')
var router = express.Router()

router.get('/:date', async (req, res) => {
  var allItems = await Outfit.find().populate('wayId').exec()
  var items = await Outfit.find({ date: req.params.date }).exec()
  var drivers = await Driver.find().exec()
  var buses = await Bus.find().exec()
  var statistic = {}

  allItems.forEach(item => {
    if(!item.wayId) {
      return
    }
    buses.forEach(bus => {
      let busId = ''+bus._id
      if(bus.way == item.wayId._id) {
        remember(statistic, busId, item.wayId._id)
        if(item.wayId.familyWay) {
          remember(statistic, busId, item.wayId.familyWay)
        }
      }
      if(item['bus'] == busId) {
        increment(statistic, busId, item.wayId._id)
        if(item.wayId.familyWay) {
          increment(statistic, busId, item.wayId.familyWay)
        }
      }
    })

    drivers.forEach(driver => {
      let driverId = ''+driver._id
      if(driver.ways.includes(item.wayId._id)) {
        remember(statistic, driverId, item.wayId._id)
        if(item.wayId.familyWay) {
          remember(statistic, driverId, item.wayId.familyWay)
        }
      }
      switch(driverId) {
        case item['firstSmene']:
          increment(statistic, driverId, item.wayId._id)
          if(item.wayId.familyWay) {
            increment(statistic, driverId, item.wayId.familyWay)
          }
          break
        case item['secondSmene']:
          increment(statistic, driverId, item.wayId._id)
          if(item.wayId.familyWay) {
            increment(statistic, driverId, item.wayId.familyWay)
          }
          break
        case item['allDay']:
          increment(statistic, driverId, item.wayId._id)
          if(item.wayId.familyWay) {
            increment(statistic, driverId, item.wayId.familyWay)
          }
          break
      }
    })
  })

  res.send({items, statistic})

  function remember(statistic, _id, wayId) {
    if(!statistic[_id]) {
      statistic[_id] = {}
    }
    if(!statistic[_id][wayId]) {
      statistic[_id][wayId] = { count: 0, isKnow: true }
    } else {
      statistic[_id][wayId].isKnow = true
    }
  }

  function increment(statistic, _id, wayId) {
    if(!statistic[_id]) {
      statistic[_id] = {}
    }
    if(!statistic[_id][wayId]) {
      statistic[_id][wayId] = { count: 0, isKnow: false }
    }
    statistic[_id][wayId].count++
  }
})

router.post('/:date', async (req, res) => {
  var result = await Outfit.deleteMany({ date: req.params.date }).exec()
  result = await Outfit.insertMany(req.body)
  res.send(result)
})

module.exports = router