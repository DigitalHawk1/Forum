{

  'use strict'

  let mongoose = require('mongoose')
  let Schema = mongoose.Schema


  let ThreadSchema = new Schema({
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
}
