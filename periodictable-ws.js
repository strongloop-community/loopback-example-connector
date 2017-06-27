var loopback = require('loopback');

var ds = loopback.createDataSource('soap',
  {
    connector: require('loopback-connector-soap'),
    wsdl: 'http://www.webservicex.net/periodictable.asmx?WSDL' // The url to WSDL
  });

// Unfortunately, the methods from the connector are mixed in asynchronously
// This is a hack to wait for the methods to be injected
ds.once('connected', function () {

  // Set up a before-execute hook to dump out the request object
  ds.connector.observe('before execute', function(ctx, next) {
    //console.log('Http Request: ', ctx.req);
    next();
  });

  // Create the model
  var PeriodictableService = ds.createModel('PeriodictableService', {});

  console.log(' \n Response from external WebService, http://www.webservicex.net/periodictable.asmx');
  PeriodictableService.GetAtomicNumber({ElementName: 'Iron'}, function (err, response) {
    console.log('\n GetAtomicNumber for Iron: \n %j', response);
  });

  PeriodictableService.GetAtomicWeight({ElementName: 'Gold'}, function (err, response) {
    console.log('\n GetAtomicWeight for Gold: \n %j', response);
  });

  PeriodictableService.GetElementSymbol({ElementName: 'Silver'}, function (err, response) {
    console.log('\n GetElementSymbol for Silver: \n %j', response);
  });

});
