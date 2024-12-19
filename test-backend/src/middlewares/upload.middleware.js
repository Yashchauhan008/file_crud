const multer = require('multer');
const config = require('../config/app.config');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (config.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only ZIP, DOCX, and PPTX files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.fileSize
  }
});

module.exports = upload;