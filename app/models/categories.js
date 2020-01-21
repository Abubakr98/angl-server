const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const СategoriesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: mongoose.Schema.Types.Decimal128,
});

MongooseAutoIncrementID.initialise('MyCustomName');
// const plugin = new MongooseAutoIncrementID(СategoriesSchema, 'Сategories');
СategoriesSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Сategories' }); // //тут законичл
mongoose.model('Сategories', СategoriesSchema);
