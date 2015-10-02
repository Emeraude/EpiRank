#!/usr/bin/env node

var Rp = require('requests-pool');
var cheerio = require('cheerio');
var cookie = require('cookie');
var config = require('./config.json');
var rp = new Rp(5);
require('pretty-console.log').enable();

function getStudent(login, cookies) {
  rp.query({protocol: 'https', host: 'intra.epitech.eu', path:'/user/' + login + '/?format=json', port: 443, method: 'GET', headers:{ 'Cookie': cookies}, retry: true}, function(e, res) {
    if (e)
      console.error(e);
    var x = '';
    res.on('data', function(d) {
      x += d;
    }).on('end', function() {
      var data = JSON.parse(x);
      console.log(login + ' : ' + data.gpa[0].gpa);
    });
  });
}

rp.query({protocol: 'https', host: 'intra.epitech.eu', path: '/', port: 443, method: 'POST'}, {login: config.login, password: config.password}, function(e, res) {
  var cookies = cookie.parse(res.headers['set-cookie'][0]);
  rp.query({protocol: 'https', host: 'intra.epitech.eu', path:'/user/complete?format=json', port: 443, method: 'GET', headers:{ 'Cookie': cookie.serialize('PHPSESSID', cookies['PHPSESSID'])}}, function(e, res) {
    var x = '';
    res.on('data', function(d) {
      x += d;
    }).on('end', function() {
      console.log('loaded');
      var students = JSON.parse(x);
      for (i in students) {
	if (students[i].promo == '2018'
	    && students[i].course == 'bachelor')
	  getStudent(students[i].login, cookie.serialize('PHPSESSID', cookies['PHPSESSID']));
      }
    });
  });
});
