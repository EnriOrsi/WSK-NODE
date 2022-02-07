var express = require('express');
var load = require('express-load');
var session = require('express-session');


module.exports = function () {
    var app = express();
    app.use('/public', express.static('public'));
    app.set('view engine', 'ejs');
    app.use(session({
        secret: 'WSKkawasakiBrasil',
        resave: true,
        saveUninitialized: true
    }));
    app.use(express.urlencoded({ extended: true }));
    load('routes').then('infra').into(app);
    return app;
}