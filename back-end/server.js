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
  var Thread = require('./models/thread')
  var Messages = require('./models/threadsMessages')
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

  // demo Route (GET http://localhost:port)
  app.get('/', cors(corsOptions), function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api')
  })

  // Start the server
  app.listen(port)
  console.log('There will be dragons: http://localhost:' + port)

  // demo Route (GET http://localhost:port)
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
  // // create a new user account (POST http://localhost:port/api/signup)
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

  // route to authenticate a user (POST http://localhost:port/api/authenticate)
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

  apiRoutes.post('/create-thread', cors(corsOptions), function (req, res) {
    if (!req.body.name) {
      res.json({success: false, msg: 'Tokia tema jau yra.'})
      next()
    } else {
      var newThread = new Thread({
        name: req.body.name,
        threadAuthor: req.body.threadAuthor
      })
    }
    newThread.save(function (err) {
      if (err) {
        console.log(err)
        return res.json({success: false, msg: 'Tokia tema jau yra.'})
      }
      res.json({success: true, msg: 'Sėkmingai sukūrėte temą.'})
    })
  })

  apiRoutes.get('/get-threads', cors(corsOptions), function (req, res) {
    Thread.find({},
      function (err, threads) {
        if (err) {
          throw err
        } else {
          res.json({
            success: true,
            threads: threads
          })
        }
      })
  })

  apiRoutes.post('/create-message', cors(corsOptions), function (req, res) {
    var newMessage = new Messages({
      threadName: req.body.threadName,
      message: req.body.message,
      messageAuthor: req.body.messageAuthor,
      lastModified: new Date()
    })
    newMessage.save(function (err) {
      if (err) {
        console.log(err)
      }
      res.json({success: true, msg: 'Sėkmingai sukūrėte pranešimą.'})
    })
  })

  apiRoutes.get('/get-messages/:threadName', cors(corsOptions), function (req, res) {
    Messages.find({
        threadName: req.params.threadName
      },
      function (err, messages) {
        if (err) {
          throw err
        } else {
          res.json({
            success: true,
            messages: messages
          })
        }
      })
  })

  apiRoutes.get('/get-message/:name', cors(corsOptions), function (req, res) {
    Messages.findOne({
        threadName: req.params.name
      },
      ['lastModified', 'messageAuthor', 'threadName'],
      {sort: {lastModified: -1}},
      function (err, message) {
        if (err) {
          throw err
        } else {
          res.json({
            success: true,
            author: message.messageAuthor,
            lastModified: message.lastModified
          })
        }
      })
  })

  apiRoutes.put('/edit-message/:id', cors(corsOptions), function (req, res) {
    Messages.findById(req.params.id, function (err, message) {
      if (err) throw err

      message.message = req.body.message
      message.lastModified = new Date()

      message.save(function (err) {
        if (err) throw err

        res.json({
          success: true,
          msg: 'Pranešimas redaguotas'
        })
      })
    })
  })

  apiRoutes.delete('/delete-message/:id', cors(corsOptions), function (req, res) {
    Messages.findByIdAndRemove(req.params.id, function (err) {
      if (err) throw err

      res.json({
        success: true,
        msg: 'Pranešimas ištrintas'
      })
    })
  })

  apiRoutes.put('/edit-thread/:id', cors(corsOptions), function (req, res) {
    Thread.findById(req.params.id, function (err, thread) {
      if (err) throw err

      thread.name = req.body.name

      thread.save(function (err) {
        if (err) throw err

        res.json({
          success: true,
          msg: 'Tema redaguota'
        })
      })
    })
  })

  apiRoutes.delete('/delete-thread/:id', cors(corsOptions), function (req, res) {
    Thread.findByIdAndRemove(req.params.id, function (err) {
      if (err) throw err

      res.json({
        success: true,
        msg: 'Tema ištrinta'
      })
    })
  })

  // route to a restricted info (GET http://localhost:port/api/memberinfo)
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
