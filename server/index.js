var fs = require('fs');
var glob = require('glob');
var path = require('path');
var express = require('express');
var configure = require('./configure');
var app = configure(express());

var local = path.join.bind(path, __dirname);

// Pages.
var pages = glob.sync('**/*.html', {
  cwd: local('../views/pages')
}).filter(function(name) {
  return name.slice(-4) === 'html';
}).map(function(name) {
  return name.slice(0, -5);
});

pages.forEach(function(page) {
  app.get('/' + page, function(req, res) {
    res.render('pages/' + page, {
      title: page,
      env: process.env.NODE_ENV
    });
  });
});

app.get('/pages', function(req, res) {
  res.json(pages);
});

app.get('/', function(req, res) {
  res.redirect('/index');
});
