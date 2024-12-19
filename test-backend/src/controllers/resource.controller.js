
// src/controllers/resource.controller.js
const ResourceService = require('../services/resource.service');
const catchAsync = require('../utils/catchAsync');

exports.uploadResource = catchAsync(async (req, res) => {
  const resource = await ResourceService.createResource(req.file, req.body);
  res.status(201).json({
    success: true,
    message: 'Resource uploaded successfully',
    data: resource
  });
});

exports.getAllResources = catchAsync(async (req, res) => {
  const resources = await ResourceService.getAllResources();
  res.status(200).json({
    success: true,
    data: resources
  });
});

exports.getResourceById = catchAsync(async (req, res) => {
  const resource = await ResourceService.getResourceById(req.params.id);
  res.status(200).json({
    success: true,
    data: resource
  });
});

exports.deleteResource = catchAsync(async (req, res) => {
  const result = await ResourceService.deleteResource(req.params.id);
  res.status(200).json({
    success: true,
    ...result
  });
});
