module.exports = function loadRoutes (app) {
  app.use('/countries', require('./countries'));
  app.use('/continents', require('./continents'));
}