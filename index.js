require('dotenv').config();
const config = require('config');
const fileSync = require('./file_sync');

const logger = require('./utils/logger')('Main', config.logger);

logger.info('Some information...');
logger.error('Some error...');
logger.warn('Some warn...');

fileSync.start();
