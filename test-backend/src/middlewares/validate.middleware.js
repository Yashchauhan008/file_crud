const ApiError = require('../utils/ApiError');

const validateResource = (req, res, next) => {
  const { topic, title, description } = req.body;
  
  if (!topic || !title || !description) {
    throw new ApiError(400, 'All fields are required: topic, title, description');
  }
  
  next();
};

module.exports = validateResource;
