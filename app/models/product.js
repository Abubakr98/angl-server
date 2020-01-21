const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const ProductSchema = new mongoose.Schema({
  product_id: Number,
  name: String,
  price: mongoose.Schema.Types.Decimal128,
});
const options = {
  field: 'product_id', // user_id will have an auto-incrementing value
};
MongooseAutoIncrementID.setDefaults(options);

MongooseAutoIncrementID.initialise('MyCustomName');
// const plugin = new MongooseAutoIncrementID(ProductSchema, 'Product');
ProductSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Product' });
mongoose.model('Product', ProductSchema);
