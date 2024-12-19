const express = require('express');
const resourceRoutes = require('./resource.routes');

const router = express.Router();

router.use('/resources', resourceRoutes);

module.exports = router;
