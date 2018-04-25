const express = require('express');
const helmet = require('helmet');

const app = express();
app.use(helmet());

app.use('/api', require('./app/api/index'));
app.use(require('./app/errors/notFound'));

module.exports = app;