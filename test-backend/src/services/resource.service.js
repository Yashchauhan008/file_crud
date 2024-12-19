const Resource = require('../models/resource.model');
const cloudinary = require('../config/cloudinary.config');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

class ResourceService {
  static async createResource(fileData, resourceData) {
    const result = await cloudinary.uploader.upload(fileData.path, {
      resource_type: 'raw',
      folder: 'resources'
    });

    const resource = new Resource({
      ...resourceData,
      fileName: fileData.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      fileType: fileData.mimetype,
      size: fileData.size
    });

    await resource.save();
    fs.unlinkSync(fileData.path);
    
    return resource;
  }

  static async getAllResources() {
    return Resource.find().sort({ uploadedAt: -1 });
  }

  static async getResourceById(id) {
    const resource = await Resource.findById(id);
    if (!resource) {
      throw new ApiError(404, 'Resource not found');
    }
    return resource;
  }

  static async deleteResource(id) {
    const resource = await this.getResourceById(id);
    await cloudinary.uploader.destroy(resource.cloudinaryId);
    await Resource.findByIdAndDelete(id);
    return { message: 'Resource deleted successfully' };
  }
}

module.exports = ResourceService;
