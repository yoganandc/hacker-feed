if(!process.env.KEY_PATH || !process.env.CERT_PATH) {
    throw new Error("key and cert paths not set in environment")
}

if(!process.env.MLAB_USERNAME || !process.env.MLAB_PASSWORD) {
    throw new Error("mlab username and password not set in environment")
}

if(!process.env.SESSION_SECRET) {
    throw new Error("session secret not set in environment")
}

if(!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET || !process.env.FACEBOOK_APP_URL) {
    throw new Error("facebook credentials not set in environment")
}

var mongoose = require("mongoose")
mongoose.connect("mongodb://" + process.env.MLAB_USERNAME + ":" + process.env.MLAB_PASSWORD + "@ds129038.mlab.com:29038/yoganandc-project")
var db = mongoose.connection

db.on("error", console.error.bind(console, "could not connect to mlab"))

db.once("open", function() {

    var express = require('express')
    var app = express()

    app.all("*", function(req, res, next) {
        if(req.secure) {
            return next();
        }
        res.redirect('https://' + req.hostname + req.url)
    })

    var bodyParser = require('body-parser')
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))

    var session = require("express-session")
    app.use(session({secret: process.env.SESSION_SECRET, saveUninitialized: false, resave: false}))

    var passport = require("passport")
    app.use(passport.initialize())
    app.use(passport.session())

    require("./app.js")(app, mongoose, passport)
    app.use(express.static(__dirname + '/public'))
    app.use(function(req, res) {
        res.redirect("/")
    })

    // use this error handler for all errors that
    // have not been caught up to this point
    app.use(function (err, req, res, next) {
        console.log(err)
        res.status(400).send({message: "Error"})
    })

    app.listen(80)

    var fs = require('fs')
    var https = require('https')

    https.createServer({
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH)
    }, app).listen(443)

    console.log("server started successfully")
})
