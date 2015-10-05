#!/usr/bin/env node

var express = require('express');
var Maria = require('mariasql');
var config = require('./config.json');

var db = new Maria(config.db);
var app = express();

function invalidRoute(req, res) {
  res.statusCode = 400;
  res.statusMessage = 'Invalid route',
  res.send(res.statusMessage);
}

function serveApi(req, res) {
  if (!req.params.promo.match(/^\d+$/))
    invalidRoute(req, res);
  else {
    query = 'SELECT * FROM `Users` WHERE `promo` = :promo';
    if (req.params.city) {
      req.params.city = '%' + req.params.city;
      query += ' AND `city` LIKE :city';
    }
    res.header('Content-Type', 'application/json')
    db.query(query, req.params, function(e, r) {
      res.send(r);
    });
  }
}

app.listen(config.port)
app.get('/api/:promo', serveApi)
  .get('/api/:promo/:city', serveApi)
  .get('/api*', invalidRoute)
  .use(function(req, res) {
    res.statusCode = 404;
    res.statusMessage = 'Not found',
    res.send(res.statusMessage);
  })
