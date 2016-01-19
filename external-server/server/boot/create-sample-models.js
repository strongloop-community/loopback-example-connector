module.exports = function(app) {
  app.models.CoffeeShop.create([
    {name: 'Bel Cafe', city: 'Vancouver'},
    {name: 'Three Bees Coffee House', city: 'San Mateo'},
    {name: 'Caffe Artigiano', city: 'Vancouver'}
  ], function(err) {
    if (err) throw err;
    console.log('> coffee shop models created');
  });
};
