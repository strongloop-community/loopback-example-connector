/* jshint camelcase: false */
var app = require('../server/server');
var client_app = require('../client/client');
var request = require('supertest');
var assert = require('assert');

function json(verb, url) {
    return request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
  }

describe('REST API request', function() {
  before(function(done) {
    require('./start-server');
    done();
  });
  
  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  it('should create a person', function(done) {
    app.models.Person.create({name: 'Fred'}, function(err, newperson) {
      console.log("Created Person...");
      console.log(err || newperson);
      assert(newperson);  
      done();
    });
  });

  var credentials = {
    email: 'foo@bar.com',
    password: '1234'
  };
  it('should create a customer', function(done) {
    app.models.Customer.create(credentials, function(err, customer) {
      console.log("Created Customer...");
      console.log(err || customer);
      assert(customer);  
      app.models.Customer.login(credentials, function(err, token){
        console.log("Logged in Customer...");
        console.log(err || token);
        assert(token);  
        done();
      });     
    });
  });
});

describe('Unexpected Usage', function(){
  it('should not crash the server when posting a bad id', function(done){
    json('post', '/api/users/foobar')
      .send({})
      .expect(404, done);
  });
});
