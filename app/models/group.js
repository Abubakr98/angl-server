const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const GroupSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: 'Назва групи',
    required: true,
  },
  des: {
    type: String,
    default: 'Це опис групи за замовчуванням',
    required: true,
  },
});

GroupSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Group' });
mongoose.model('Group', GroupSchema);
