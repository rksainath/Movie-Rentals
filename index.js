const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logger')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);



const port = process.env.PORT || 3000;
const server = app.listen(port,() => winston.info(`Connected to PORT ${port}`));

module.exports = server;