(function () {
  'use strict'

  var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
  var User = require('../models/user')
  var config = require('./database') // get db config file

  module.exports = function (passport) {
    var opts = {}
    opts.secretOrKey = config.secret
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({id: jwt_payload.id}, function (err, user) {
        if (err) {
          return done(err, false)
        }
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    }))
  }
})()
