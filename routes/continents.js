const express = require('express');
const router = express.Router();

const ContinentModel = require('../models/Continent');
const CountryModel = require('../models/Country');
const {toObjectID, getUniques} = require('../utils');

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
    {$match: {_id: toObjectID(continentID)}},
    {$addFields: {countryCount: {$size: '$countries'}}},
    {$lookup: {from: 'countries', localField: 'countries', 'foreignField': '_id', as: 'countries'}}
  ]);

  if (continents.length === 0) res.status(400).json({
    'msg': 'continent not found'
  });

  res.status(200).json(continents[0]);
});

//4 first by alphabetical order
router.get('/top4alphabetical', async (req, res) => {
  const continentId = req.params.id;

  const continents = await ContinentModel.find({}).populate({
    path: 'countries',
    options: {
      sort: {'name': 1},
      limit: 4,
    }
  });

  return res.status(200).json(continents);
});

router.post('/', async (req, res) => {
  const {name, countries} = req.body;
  const continent = await ContinentModel.create({
    name: name,
    countries: getUniques(countries) || [],
  });

  if (continent.countries.length !== 0) {
    await CountryModel.updateMany({_id: {$in: continent.countries.map((c) => c.toString())}}, {continent: continent._id});
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

  for (const continent of createdContinents) {
    if (continent.countries.length !== 0) {
      await CountryModel.updateMany({_id: {$in: continent.countries.map((c) => c.toString())}}, {continent: continent._id});
    }
  }

  res.status(200).json(createdContinents);
});

router.put('/:id', async (req, res) => {
  const continentID = req.params.id;
  const {name, countries} = req.body;

  let continent = await ContinentModel.findOne({_id: continentID});
  const toDelete = [];
  for (const country_id of continent.countries) {
    if (!countries.includes(country_id)) {
      toDelete.push(country_id)
    }
  }
  await CountryModel.updateMany({_id: {$in: toDelete}}, {$unset: {continent: ''}});
  await CountryModel.updateMany({_id: {$in: countries}}, {continent: continent._id});

  continent = await ContinentModel.findOneAndUpdate({_id: continentID}, {name, countries}, {new: true})

  return res.status(200).json(continent);
});

router.delete('/:id', async (req, res) => {
  const continentId = req.params.id;

  await ContinentModel.findOneAndDelete({_id: continentId});
  await CountryModel.updateMany({continent: continentId}, {$unset: {continent: ''}});

  res.status(200).json({
    'msg': 'continent deleted'
  });
});

module.exports = router;