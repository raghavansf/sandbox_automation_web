import express from 'express';
import http from 'http';
import {} from 'dotenv/config';
import logger from './logger.js';
const app = express();
app.set('port', process.env.PORT || 5000);

// Try to define BasePath and routes ..

// Endpoints

app.use('/config', function (req, res) {
  logger.log('info', 'Displaying ENV values ..', {
    message: process.env.DB_HOST,
  });
});

const server = http.createServer(app);
server.listen(app.get('port'), () =>
  logger.info(
    `Provisioning Manager App listening to port ${app.get(
      'port'
    )} for accepting requests`
  )
);
