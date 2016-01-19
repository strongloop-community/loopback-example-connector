module.exports = function(Customer) {
  Customer.myMethod = function(cb) {
    cb();
  };

  Customer.remoteMethod('myMethod', {
    isStatic: true,
    returns: {
      arg: 'user',
      type: 'Customer'
    }
  });
};
