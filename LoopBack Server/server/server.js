var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// boot scripts mount components like REST API
boot(app, __dirname);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl); //eslint-disable-line no-console
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath); //eslint-disable-line no-console
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
