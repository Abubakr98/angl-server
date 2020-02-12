const mongoose = require('mongoose');

const CronLogger = require('./cronLogger');

const options = {
  era: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  timezone: 'UTC',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};


const User = mongoose.model('User');
module.exports = () => {
  User.deleteMany({ emailVerified: false })// deleteMany User has been deleted.
    .exec()
    .then((users) => {
      CronLogger(`Користувачі на видалення, було знайденно: ${users.n}, було видаленно: ${users.deletedCount}, в ${new Date().toLocaleString('ru', options)}\n`);
    })
    .catch(err => console.log(err));
};
