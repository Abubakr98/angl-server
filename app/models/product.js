const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: mongoose.Schema.Types.Decimal128,
});
ProductSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Product' });
mongoose.model('Product', ProductSchema);
