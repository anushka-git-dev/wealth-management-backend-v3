const { protect } = require('./auth');
const errorHandler = require('./errorHandler');
const logger = require('./logger');

module.exports = {
  protect,
  errorHandler,
  logger
};
