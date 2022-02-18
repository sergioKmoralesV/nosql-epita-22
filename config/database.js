const mongoose = require('mongoose');

console.log('starting connection!');

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},(error) => {
  if(error) throw error;
  console.log('connected to the database.');
});
