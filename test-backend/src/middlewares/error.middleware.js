const ApiError = require('../utils/ApiError');
const config = require('../config/app.config');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    ...(config.env === 'development' && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
