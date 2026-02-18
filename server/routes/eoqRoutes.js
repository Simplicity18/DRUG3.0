const express = require('express');
const { calculateEOQ } = require('../controllers/eoqController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.post('/calculate', calculateEOQ);

module.exports = router;
