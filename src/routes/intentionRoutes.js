const express = require('express');
const router = express.Router();
const intentionController = require('../controllers/intentionController');
const { protectRoute } = require('../middlewares/auth');

// Middleware to protect all routes below
router.use(protectRoute);

/**
 * @swagger
 * /intentions/stats:
 * get:
 * summary: Retrieve financial dashboard statistics
 * tags: [Stats]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Success
 * 401:
 * description: Unauthorized - Token missing or invalid
 */
router.get('/stats', intentionController.getUserStats);

router.post('/', intentionController.createIntention);
router.put('/:id/realize', intentionController.realizeIntention);
router.put('/:id/abort', intentionController.abortIntention);
router.get('/', intentionController.getAllIntentions);
router.delete('/:id', intentionController.deleteIntention);

module.exports = router;