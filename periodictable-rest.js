var loopback = require('loopback');
var path = require('path');

var app = module.exports = loopback();

app.set('restApiRoot', '/api');

var ds = loopback.createDataSource('soap',
  {
    connector: require('loopback-connector-soap'),
    remotingEnabled: true,
    wsdl: 'http://www.webservicex.net/periodictable.asmx?WSDL' // The url to WSDL
  });

// Unfortunately, the methods from the connector are mixed in asynchronously
// This is a hack to wait for the methods to be injected
ds.once('connected', function () {

  // Create the model
  var PeriodictableService = ds.createModel('PeriodictableService', {});

  // External PeriodTable WebService operation exposed as REST APIs through LoopBack
  PeriodictableService.atomicnumber = function (elementName, cb) {
    PeriodictableService.GetAtomicNumber({ElementName: elementName || 'Copper'}, function (err, response) {
      var result = response;
      cb(err, result);
    });
  };

  // External PeriodTable WebService operation exposed as REST APIs through LoopBack
  PeriodictableService.atomicweight = function(elementName, callback) {
    PeriodictableService.GetAtomicWeight({ElementName: elementName || 'Copper'}, function (err, response) {
      var result = response;
      callback(err, result);
    });
  }

  // Map to REST/HTTP
  loopback.remoteMethod(
      PeriodictableService.atomicnumber, {
        accepts: [
          {arg: 'elementName', type: 'string', required: true,
            http: {source: 'query'}}
        ],
        returns: {arg: 'result', type: 'object', root: true},
        http: {verb: 'get', path: '/GetAtomicNumber'}
      }
  );

  loopback.remoteMethod(
      PeriodictableService.atomicweight, {
        accepts: [
          {arg: 'elementName', type: 'string', required: true,
            http: {source: 'query'}}
        ],
        returns: {arg: 'result', type: 'object', root: true},
        http: {verb: 'get', path: '/GetAtomicWeight'}
    }
  );

  // Expose to REST
  app.model(PeriodictableService);

  // LoopBack REST interface
  app.use(app.get('restApiRoot'), loopback.rest());
  // API explorer (if present)
  try {
    var explorer = require('loopback-explorer')(app);
    app.use('/explorer', explorer);
    app.once('started', function (baseUrl) {
      console.log('Browse your REST API at %s%s', baseUrl, explorer.route);
    });
  } catch (e) {
    console.log(
      'Run `npm install loopback-explorer` to enable the LoopBack explorer'
    );
  }

  app.use(loopback.urlNotFound());

  if (require.main === module) {
    app.start();
  }

});

app.start = function () {
  return app.listen(3000, function () {
    var baseUrl = 'http://127.0.0.1:3000';
    app.emit('started', baseUrl);
    console.log('Use API explorer to invoke REST APIS @ %s%s', baseUrl, '/explorer');
  });
};



