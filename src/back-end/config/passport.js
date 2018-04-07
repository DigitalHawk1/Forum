{
  'use strict'

  let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
  let User = require('../models/user')
  let config = require('./database') // get db config file

  module.exports = passport => {
    let opts = {}
    opts.secretOrKey = config.secret
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({id: jwt_payload.id}, (err, user) => {
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
}
