{
  'use strict'

  module.exports = {
    'secret': process.env.SECRET,
    'database': 'mongodb://localhost:27017/' + process.env.DB_NAME
  }
}
