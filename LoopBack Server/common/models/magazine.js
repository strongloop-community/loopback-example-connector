module.exports = function(Magazine) {

  // Magazine.observe('before save', function(ctx, next) {

  //   console.log('> Magazine before save triggered');

  //   var model = ctx.instance;
  //   var coffeeShopService = Magazine.app.dataSources.CoffeeShopService;

  //   coffeeShopService.find(function(err, response, context) {
  //     if (err) throw err; //error making request
  //     if (response.error) {
  //       next('> response error: ' + response.error.stack);
  //     }
  //     model.coffeeShops = response;
  //     console.log('> coffee shops fetched successfully from remote server');
  //     //verify via `curl localhost:3000/api/Magazines`
  //     next();
  //   });
  // });  

  Magazine.getCoffeeShops = function(name, cb) {  
    CoffeeShopService = Magazine.app.dataSources.CoffeeShopService;
    CoffeeShopService.find(function(err, res) {
      if (err) cb(err);
      var coffeeShop = 'No Coffee Shops by the name of ' + name;
      res.forEach(function(element) {
        if (element.name === name) coffeeShop = element;
      });
      if (typeof coffeeShop === 'string') cb(coffeeShop);
      cb(null, coffeeShop);
    });
  }

  Magazine.remoteMethod('getCoffeeShops', {
    accepts: [{arg: 'name', type: 'string', http: {source: 'query'}, required: true}],
    returns: {arg: 'response', type: 'object', root: true},
    http: {path: '/', verb: 'get'}
  });

};
