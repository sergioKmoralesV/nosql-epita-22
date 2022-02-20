const express = require('express');
const router = express.Router()

const CountryModel = require('../models/Country');

router.get('/', async (req, res) => {
  const countries = await CountryModel.find({});
  return res.status(200).json(countries);
});

router.get('/count', async (req, res) => {
  const totalCountries = await CountryModel.count();
  return res.status(200).json({
    "msg": `total countries: ${totalCountries}`
  });
});

router.get('/count/:name', async (req, res) => {
  const name = req.params.name;
  const totalCountries = await CountryModel.count({
    name: new RegExp('^' + name + '.*'),
  });
  return res.status(200).json({
    "msg": `total countries starting with ${name} : ${totalCountries}`
  });
});

router.get('/:id', async (req, res) => {
  const countryID = req.params.id;
  const country = await CountryModel.findOne({_id: countryID});

  if(!country) res.status(400).json({
    'msg': 'country not found'
  });
  return res.status(200).json(country);
});


router.delete('/:id', async (req, res) => {
  const countryID = req.params.id;

  await CountryModel.findOneAndDelete({_id: countryID});
  res.status(200).json({
    'msg': 'country deleted'
  });
});

router.post('/', async (req, res) => {
  const country = await CountryModel.create({
    name: req.body.name,
    isoCode: req.body.isoCode,
  });

  return res.status(200).json(country);
});

router.put('/:id', async (req, res) => {
  const countryID = req.params.id;
  const {name, isoCode} = req.body;

  const country = await CountryModel.findByIdAndUpdate({_id: countryID}, {name, isoCode}, {new: true});
  return res.status(200).json(country);
});

module.exports = router;