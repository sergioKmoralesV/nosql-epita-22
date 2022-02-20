require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

require('./routes')(app);
require('./config/database');

app.get('/', (req, res) => {
  return res.status(200).json({
    'msg': 'Hello world!'
  });
});

app.listen(3000, () => {
  console.log('server running ...');
});