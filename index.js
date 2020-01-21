const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
const swaggerDocument = require('./swagger.json');
// const bodyParser = require('body-parser');
require('./app/models');
const config = require('./config');

const app = express();
app.use('/api/v1.0', express.static(`${__dirname}/public`));
app.use('/swagger/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// log only 4xx and 5xx responses to console
app.use(logger('dev', {
  skip: (req, res) => { return res.statusCode < 400; },
}));
// log all requests to access.log
app.use(logger('combined', {
  skip: (req, res) => { return res.statusCode < 400; },
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
}));

config.express(app);

// config.routes(app);
app.use('/api/v1.0', config.router);


const { mongoUri, appPort } = config.app;
mongoose.set('useFindAndModify', false); // здесь даем добро на использовние устревших методов
mongoose.set('useCreateIndex', true); // здесь даем добро на использовние устревших методов
mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    app.listen(appPort, () => {
      console.log('server is running on port 3000...');
    });
  })
  .catch(err => console.error(`Error connection to mongodb: ${mongoUri}`, err));
