require('dotenv').config();
const express = require('express');

// models
const CountryModel = require('./models/Country');

const app = express();
app.use(express.json());

require('./config/database');

app.get('/', (req, res) => {
  return res.status(200).json({
    'msg': 'Hello world!'
  });
});

app.get('/countries', async (req, res) => {
  const countries = await CountryModel.find({});
  return res.status(200).json(countries);
});

app.get('/countries/count', async (req, res) => {
  const totalCountries = await CountryModel.count();
  return res.status(200).json({
    "msg": `total countries: ${totalCountries}`
  });
});

app.get('/countries/count/:name', async (req, res) => {
  const name = req.params.name;
  const totalCountries = await CountryModel.count({
    name: new RegExp('^' + name + '.*'),
  });
  return res.status(200).json({
    "msg": `total countries starting with ${name} : ${totalCountries}`
  });
});

app.get('/countries/id/:id', async (req, res) => {
  const countryID = req.params.id;
  const country = await CountryModel.findOne({_id: countryID});

  if(!country) res.status(400).json({
    'msg': 'country not found'
  });
  return res.status(200).json(country);
});

app.get('/countries/:isoCode', async (req, res) => {
  const countryCode = req.params.isoCode;
  const country = await CountryModel.findOne({isoCode: countryCode});

  if(!country) res.status(400).json({
    'msg': 'country not found'
  });
  return res.status(200).json(country);
});

app.delete('/countries/id/:id', async (req, res) => {
  const countryID = req.params.id;

  await CountryModel.findOneAndDelete({_id: countryID});
  res.status(200).json({
    'msg': 'country deleted'
  });
});

app.delete('/countries/:isoCode', async (req, res) => {
  const countryCode = req.params.isoCode;

  await CountryModel.findOneAndDelete({isoCode: countryCode});
  res.status(200).json({
    'msg': 'country deleted'
  });
});

app.post('/countries', async (req, res) => {
  console.log(req.body);

  const country = await CountryModel.create({
    name: req.body.name,
    isoCode: req.body.isoCode,
  });

  return res.status(200).json(country);
});

app.put('/countries/:id', async (req, res) => {
  const countryID = req.params.id;
  const {name, isoCode} = req.body;

  const country = await CountryModel.findByIdAndUpdate({_id: countryID}, {name, isoCode}, {new: true});
  return res.status(200).json(country);
});

app.listen(3000, () => {
  console.log('server running ...');
});