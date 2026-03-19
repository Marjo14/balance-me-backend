const express = require('express');
const router = express.Router();
const intentionController = require('../controllers/intentionController');

/**
 * @swagger
 * /intentions/stats:
 * get:
 * summary: Retrieve financial dashboard statistics
 * tags: [Stats]
 * responses:
 * 200:
 * description: Success
 */
router.get('/stats', intentionController.getUserStats);
router.post('/', intentionController.createIntention);
router.put('/:id/realize', intentionController.realizeIntention);
router.put('/:id/abort', intentionController.abortIntention);
router.get('/', intentionController.getAllIntentions);
router.delete('/:id', intentionController.deleteIntention);

module.exports = router;