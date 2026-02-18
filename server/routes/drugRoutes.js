const express = require('express');
const { body, param } = require('express-validator');
const {
  getDrugs,
  getDrugById,
  createDrug,
  updateDrug,
  deleteDrug,
  sellDrug
} = require('../controllers/drugController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getDrugs);
router.get('/:id', param('id').isMongoId(), getDrugById);
router.post('/', [
  body('name').trim().notEmpty(),
  body('batchNumber').trim().notEmpty(),
  body('manufacturer').trim().notEmpty(),
  body('expiryDate').isISO8601(),
  body('quantity').isInt({ min: 0 }),
  body('costPrice').isFloat({ min: 0 }),
  body('sellingPrice').isFloat({ min: 0 }),
  body('reorderLevel').optional().isInt({ min: 0 })
], createDrug);
router.put('/:id', param('id').isMongoId(), updateDrug);
router.delete('/:id', param('id').isMongoId(), deleteDrug);
router.post('/sell', [
  body('drugId').isMongoId(),
  body('quantity').isInt({ min: 1 }),
  body('useFIFO').optional().isBoolean()
], sellDrug);

module.exports = router;
