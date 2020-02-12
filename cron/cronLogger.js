const fse = require('fs-extra');
const path = require('path');

const file = path.join(__dirname, 'cronLogger.txt');

module.exports = (data) => {
  if (!fse.existsSync(file)) {
    fse.writeFile(file, '').catch((err) => {
      if (err) throw err;
    });
  }
  fse.appendFile(file, data).catch(err => console.log(err));
};
