module.exports = function loadRoutes (app) {
  const countriesRoutes = require('./countries');

  app.use('/countries', countriesRoutes);
}