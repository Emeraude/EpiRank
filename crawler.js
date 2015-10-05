#!/usr/bin/env node

var Rp = require('requests-pool');
var Maria = require('mariasql');
var cookie = require('cookie');
var config = require('./config.json');

var rp = new Rp(5);
var db = new Maria(config.db);

function currentScolarYear() {
  var d = new Date();

  if (d.getMonth() > 7)
    return d.getFullYear();
  return d.getFullYear() - 1;
}

function getStudent(login, cookies) {
  rp.request({protocol: 'https', host: 'intra.epitech.eu', path:'/user/' + login + '/?format=json', port: 443, method: 'GET', headers:{ 'Cookie': cookies}, retry: true}, function(e, res) {
    if (e)
      console.error(e);
    var x = '';
    res.on('data', function(d) {
      x += d;
    }).on('end', function() {
      var student = JSON.parse(x);
      if (student.scolaryear != currentScolarYear())
	return;
      var data = {
	login: login,
	firstname: student.firstname,
	lastname: student.lastname,
	promo: student.promo,
	gpaBachelor: student.gpa[0].gpa,
	gpaMaster: student.gpa[1] && student.gpa[1].gpa,
	city: student.location,
	credits: student.credits,
	availableSpices: student.spice && student.spice.available_spice,
	consumedSpices: student.spice && student.spice.consumed_spice
      };
      db.query('INSERT INTO `Users`(`login`, `firstname`, `lastname`, `promo`, `gpaBachelor`, `gpaMaster`, `city`, `credits`, `availableSpices`, `consumedSpices`) VALUES(:login, :firstname, :lastname, :promo, :gpaBachelor, :gpaMaster, :city, :credits, :availableSpices, :consumedSpices) ON DUPLICATE KEY UPDATE `promo` = VALUES(`promo`), `gpaBachelor` = VALUES(`gpaBachelor`), `gpaMaster` = VALUES(`gpaMaster`), `city` = VALUES(`city`), `credits` = VALUES(`credits`), `availableSpices` = VALUES(`availableSpices`), `consumedSpices` = VALUES(`consumedSpices`)', data, { metadata: true }, function(e, r) {
	if (e) {
	  console.error(e);
	  return;
	}
	console.log(login + ' added');
      });
    });
  });
}

rp.request({protocol: 'https', host: 'intra.epitech.eu', path: '/', port: 443, method: 'POST'}, {login: config.login, password: config.password}, function(e, res) {
  var cookies = cookie.parse(res.headers['set-cookie'][0]);
  rp.request({protocol: 'https', host: 'intra.epitech.eu', path:'/user/complete?format=json', port: 443, method: 'GET', headers:{ 'Cookie': cookie.serialize('PHPSESSID', cookies['PHPSESSID'])}}, function(e, res) {
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
