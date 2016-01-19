app = require('../client/client');

// call a method on the server
app.models.Person.create({
  name: 'Fred'
}, function(err, newperson) {
  console.log("Created Person...");
  console.log(err || newperson);
});

