const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const upload = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/upload',
  upload.single('file'),
  validate,
  resourceController.uploadResource
);
router.get('/', resourceController.getAllResources);
router.get('/:id', resourceController.getResourceById);
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
