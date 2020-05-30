const { CronJob } = require('cron');
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
const job = new CronJob('*/30 * * * *', (() => {
  CronLogger(`Не даем спать: ${new Date().toLocaleString('ru', options)}\n`);
//   fetch('https://jsonplaceholder.typicode.com/todos/1').then(() => {
//     CronLogger(`Не даем спать сервер ответил: ${new Date().toLocaleString('ru', options)}\n`);
//   }).catch(() => {
//     CronLogger(`Не даем спать сервер ответил c ошыбкой: ${new Date().toLocaleString('ru', options)}\n`);
//   });
}));
job.start();
