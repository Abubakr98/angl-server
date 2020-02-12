const { CronJob } = require('cron');
const CronLogger = require('./cronLogger');
const UserRemover = require('./user');

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

console.log(`Початок ініціалізації роботи: ${new Date().toLocaleString('ru', options)}\n`);

const job = new CronJob('56 10 * * *', (() => { //* /1 * * * *
  CronLogger(`Робота почалась: ${new Date().toLocaleString('ru', options)}\n`);
  UserRemover();
  CronLogger(`Робота закінчалась: ${new Date().toLocaleString('ru', options)}\n`);
}));
console.log(`Завершення ініціалізації роботи: ${new Date().toLocaleString('ru', options)}\n`);
job.start();
