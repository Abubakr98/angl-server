const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const WordSchema = new mongoose.Schema({
  en: {
    type: String,
    default: 'Word',
    required: true,
  },
  ua: {
    type: String,
    default: 'Слово',
    required: true,
  },
  des: {
    type: String,
    default: 'Це опис слова за замовчуванням',
    required: true,
  },
  group: {
    type: String,
    default: 'other',
    required: true,
  },
  examples: {
    type: Array,
    default: ['Інше', 'Інше'],
    required: true,
  },
});

WordSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'Word' });
mongoose.model('Word', WordSchema);
