const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
