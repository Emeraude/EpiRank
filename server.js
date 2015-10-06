#!/usr/bin/env node

var express = require('express');
var jade = require('jade');
var Maria = require('mariasql');
var config = require('./config.json');

var db = new Maria(config.db);
var app = express();

function invalidRoute(req, res) {
  res.statusCode = 400;
  res.header('Content-Type', 'text/html')
  res.statusMessage = 'Invalid route',
  res.send(res.statusMessage);
}

function serveApi(req, res) {
  res.header('Content-Type', 'application/json')
  if (req.params.promo.match(/^\w{1,6}_\w$/)) {
    db.query('SELECT * FROM `Users` WHERE login = :login', {login: req.params.promo}, function(e, r) {
      res.send(r[0] || {});
    });
  }
  else if (req.params.promo.match(/^\d+$/)) {
    query = 'SELECT * FROM `Users` WHERE `promo` = :promo';
    if (req.params.city) {
      req.params.city = '%' + req.params.city;
      query += ' AND `city` LIKE :city';
    }
    db.query(query, req.params, function(e, r) {
      res.send(r);
    });
  }
  else
    invalidRoute(req, res);
}

app.listen(config.port)
app.engine('jade', jade.__express)
  .use(require('compression')())
  .use(require('serve-static')('public/'))
  .get('/api/:promo', serveApi)
  .get('/api/:promo/:city', serveApi)
  .get('/api*', invalidRoute)
  .get('/', function(req, res) {
    res.render('home.jade');
  })
  .use(function(req, res) {
    res.statusCode = 404;
    res.statusMessage = 'Not found',
    res.send(res.statusMessage);
  })
