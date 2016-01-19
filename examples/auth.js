var async = require('async');

// the client loopback application
var app = require('../client/client');

// the Customer model
var Customer = app.models.Customer;

// the remote datasource
var remoteDs = app.dataSources.remoteDS;

// the strong-remoting RemoteObjects instance
var remotes = remoteDs.connector.remotes;

// the example user credentials
var credentials = {
  email: 'foo@bar.com',
  password: '1234'
};

async.series([
  function(next) {
    Customer.myMethod(function(err) {
      if(err) {
        console.log('Got error (%s) when trying to call method without auth', err.message);
      }
      next();
    });
  },
  function(next) {
    // register a user
    Customer.create(credentials, handleError(function(err) {
      console.log('Registered a user');
      next();
    }));
  },
  function(next) {
    // login as the newly created user
    Customer.login(credentials, handleError(function(err, token) {
      console.log('Logged in as', credentials.email);

      // store the token to allow logout
      credentials.token = token;

      // set the access token to be used for all future invocations
      remotes.auth = {
        bearer: (new Buffer(token.id)).toString('base64'),
        sendImmediately: true
      };
      console.log('Set access token for all future requests. (%s)', remotes.auth.bearer);
      next();
    }));
  },
  function(next) {
    // this method can only be called by logged in users
    Customer.myMethod(handleError(function(err) {
      console.log('Called a custom method (myMethod) as a logged in user');
      next();
    }));
  },
  function(next) {
    Customer.logout(credentials.token.id, handleError(function(err) {
      console.log('Logged out and unset the acces token for future invocations');
      // unset the access token for future invocations
      remotes.auth = null;
      next();
    }));
  },
  function(next) {
    Customer.myMethod(function(err) {
      if(err) {
        console.log('Got error (%s) when trying to call method without auth', err.message);
      }
    });
  }
]);

// utility for handling errors
function handleError(fn) {
  return function(err) {
    if(err) {
      console.error(err);
      process.exit();
    } else {
      fn.apply(this, arguments);
    }
  };
}
