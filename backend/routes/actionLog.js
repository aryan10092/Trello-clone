const express = require('express');
const router = express.Router();
const actionLogController = require('../controllers/actionLogController');
const auth = require('../middleware/authMiddleware');

router.use(auth);
router.get('/', actionLogController.getRecentActions);

module.exports = router; 