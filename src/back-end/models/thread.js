(function () {

  'use strict'

  var mongoose = require('mongoose')
  var Schema = mongoose.Schema


  var ThreadSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    threadAuthor: {
      type: String,
      required: true
    }
  })

  module.exports = mongoose.model('Threads', ThreadSchema)
})()
