(function () {
  'use strict'

  var express = require('express')
  var app = express()
  var bodyParser = require('body-parser')
  var morgan = require('morgan')
  var mongoose = require('mongoose')
  var passport = require('passport')
  var config = require('./config/database') // get db config file
  var User = require('./models/user') // get the mongoose model
  var port = 8888
  var jwt = require('jwt-simple')
  var cors = require('cors')

  // get our request parameters
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

  app.use(cors())

  var corsOptions = {
    origin: 'http://forumas.lt',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

  // log to console
  app.use(morgan('dev'))

  // Use the passport package in our application
  app.use(passport.initialize())

  // demo Route (GET http://localhost:8888)
  app.get('/', cors(corsOptions), function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api')
  })

  // Start the server
  app.listen(port)
  console.log('There will be dragons: http://localhost:' + port)

  // demo Route (GET http://localhost:8888)
  // ...

  // connect to database
  mongoose.connect(config.database)

  // pass passport for configuration
  require('./config/passport')(passport)

  // // bundle our routes
  var apiRoutes = express.Router()

  apiRoutes.get('/', function (req, res) {
    return res.json({success: false, msg: 'Prisijungimo vardas arba el.paštas užimtas.'})
  })
  //
  // // create a new user account (POST http://localhost:8888/api/signup)
  apiRoutes.post('/signup', cors(corsOptions), function (req, res) {
    if (!req.body.name || !req.body.lastName || !req.body.username ||
      !req.body.password || !req.body.email || !req.body.phone) {
      res.json({success: false, msg: 'Užpildykite visus laukelius.'})
    } else {
      var newUser = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        username: req.body.username,
        passwordHash: req.body.password,
        email: req.body.email,
        phone: req.body.phone,
        userStatus: 'user'
      })
      // save the user
      newUser.save(function (err) {
        if (err) {
          return res.json({success: false, msg: 'Prisijungimo vardas arba el.paštas užimtas.'})
        }
        res.json({success: true, msg: 'Sėkmingai užsiregistravote.'})
      })
    }
  })

  // connect the api routes under /api/
  app.use('/api', apiRoutes)

  // route to authenticate a user (POST http://localhost:8888/api/authenticate)
  apiRoutes.post('/authenticate', cors(corsOptions), function (req, res) {
    User.findOne({
        username: req.body.username
      },
      function (err, user) {
        if (err) throw err

        if (!user) {
          res.send({success: false, msg: 'Vartotojas nerastas.'})
        } else {
          // check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              // if user is found and password is right create a token
              var token = jwt.encode(user, config.secret)
              // return the information including token as JSON

              res.json({
                success: true,
                token: 'JWT ' + token,
                userStatus: user.userStatus
              })
            } else {
              res.send({success: false, msg: 'Neteisingas slaptažodis arba prisijungimo vardas.'})
            }
          })
        }
      })
  })

  // route to a restricted info (GET http://localhost:8888/api/memberinfo)
  apiRoutes.get('/memberinfo', cors(corsOptions), passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers)
    if (token) {
      var decoded = jwt.decode(token, config.secret)
      User.findOne({
        username: decoded.username
      }, function (err, user) {
        if (err) throw err

        if (!user) {
          return res.status(403).send({success: false, msg: 'Vartotojas nerastas.'})
        } else {
          res.json({
            success: true,
            name: user.name,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            phone: user.phone
          })
        }
      })
    } else {
      return res.status(403).send({success: false, msg: 'No token provided.'})
    }
  })

  var getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ')
      if (parted.length === 2) {
        return parted[1]
      } else {
        return null
      }
    } else {
      return null
    }
  }
})()