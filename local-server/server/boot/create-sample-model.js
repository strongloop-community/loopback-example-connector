module.exports = function(app) {
  app.models.Magazine.create([
    {name: 'Bean around the world'}
  ], function(err) {
    if (err) throw err;
    console.log('> magazine model created');
  });
};
