const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const ContinentModel = require('../models/Continent');
const CountryModel = require('../models/Country');

router.get('/', async (req, res) => {
  const continents = await ContinentModel.aggregate([
    {$addFields: {countryCount: {$size: '$countries'}}},
    {$lookup: {from: 'countries', localField: 'countries', 'foreignField': '_id', as: 'countries'}}
  ]);
  res.status(200).json(continents);
});

router.get('/:id', async (req, res) => {
  const continentID = req.params.id;
  const continents = await ContinentModel.aggregate([
    {$match: {_id: mongoose.Types.ObjectId(continentID)}},
    {$addFields: {countryCount: {$size: '$countries'}}},
    {$lookup: {from: 'countries', localField: 'countries', 'foreignField': '_id', as: 'countries'}}
  ]);

  if(continents.length === 0) res.status(400).json({
    'msg': 'continent not found'
  });

  res.status(200).json(continents[0]);
});

router.post('/', async (req, res) => {
  const {name, countries} = req.body;
  const continent = await ContinentModel.create({
    name: name,
    countries: countries || [],
  });

  if(continent.countries.length !== 0) {
    await CountryModel.updateMany({_id: {$in: continent.countries.map((c) => c.toString())}}, {continent: continent._id})
  }
  res.status(200).json(continent);
});

router.post('/many', async (req, res) => {
  const {continents} = req.body;
  const input = continents.map((value) => ({
    name: value.name,
    countries: value.countries || []
  }));
  const createdContinents = await ContinentModel.insertMany(input);

  for(const continent of createdContinents) {
    //to refactor
    if(continent.countries.length !== 0) {
      await CountryModel.updateMany({_id: {$in: continent.countries.map((c) => c.toString())}}, {continent: continent._id})
    }
  }

  res.status(200).json(createdContinents);
});

router.put('/:id', async (req, res) => {
  const continentId = req.params.id;
  const {name, countries} = req.body;

  const continent = await ContinentModel.findOneAndUpdate({_id: continentId}, {name, countries}, {new: true});

  return res.status(200).json(continent);
});

router.delete('/:id', async (req, res) => {
  const continentId = req.params.id;

  await ContinentModel.findOneAndDelete({_id: continentId});
  res.status(200).json({
    'msg': 'continent deleted'
  });
});

module.exports = router;