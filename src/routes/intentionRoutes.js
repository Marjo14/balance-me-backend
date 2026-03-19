const express = require('express');
const router = express.Router();
const intentionController = require('../controllers/intentionController');

// 1. Create a new intention (POST)
// @route POST /intentions
router.post('/', intentionController.createIntention);

// 2. Confirm and realize an expense (PUT)
// @route PUT /intentions/:id/realize
router.put('/:id/realize', intentionController.realizeIntention);

// 3. Cancel an expense and record a "Victory" (PUT)
// @route PUT /intentions/:id/abort
router.put('/:id/abort', intentionController.abortIntention);

module.exports = router;