var fs = require('fs');
var http = require('http');
var path = require('path');
var express = require('express');
var reload = require('reload');
var combynExpress = require('combynexpress');

var local = path.join.bind(path, __dirname);
var staticDirs = ['dist', 'views', 'client', 'node_modules', 'package.json'];

var port = process.env.PORT || 8000;
var host = process.env.HOST;
var env = process.env.NODE_ENV || 'test';

// Ensure global exceptions do not crash the server.
process.on('uncaughtException', function(ex) {
  console.log(ex, ex.stack);
});

module.exports = function(server) {
  var app = http.createServer(server);

  reload(app, server, 1000);

  // Set the view engine.
  server.engine('html', combynExpress());
  server.set('views', local('../views'));
  server.set('view engine', 'html');

  // Set environment related configuration.
  if (env === 'production') {
    host = host || '0.0.0.0';

    server.use('/', express.static(path.resolve('dist')));
    server.use('/node_modules', express.static(path.resolve('node_modules')));
  }
  else if (env === 'test') {
    host = host || '0.0.0.0';
  }

  // Make static directories available.
  staticDirs.forEach(function(name) {
    server.use('/' + name, express.static(local('../' + name)));
  });

  // Listen server on the given port and host.
  if (port) {
    server.port = port;
    server.host = host;
    app.listen(port, host);
  }

  return server;
};
