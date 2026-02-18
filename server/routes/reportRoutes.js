const express = require('express');
const {
  getStockReport,
  getStockMovementHistory,
  exportToCSV
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/stock', getStockReport);
router.get('/movements', getStockMovementHistory);
router.get('/export/csv', exportToCSV);

module.exports = router;
