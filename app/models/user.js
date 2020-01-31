const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const userWordsSchema = new mongoose.Schema({
  id: Number,
  is_learned: Boolean,
  group: String,
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  words: [userWordsSchema],
});
const options = {
  field: 'id', // id will have an auto-incrementing value
};
MongooseAutoIncrementID.setDefaults(options);
UserSchema.plugin(MongooseAutoIncrementID.plugin, { modelName: 'User' });
mongoose.model('User', UserSchema);
