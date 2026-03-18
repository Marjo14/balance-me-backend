const express = require('express');
const router = express.Router();
const intentionController = require('../controllers/intentionController');

// Map URL to Controller
router.post('/', intentionController.createIntention);

module.exports = router;