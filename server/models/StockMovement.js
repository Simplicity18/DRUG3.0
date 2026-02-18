const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  drugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drug',
    required: true
  },
  drugName: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['IN', 'OUT', 'ADJUSTMENT', 'SALE'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  previousQuantity: {
    type: Number,
    default: 0
  },
  newQuantity: {
    type: Number,
    required: true
  },
  reference: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

stockMovementSchema.index({ drugId: 1, date: -1 });
stockMovementSchema.index({ date: -1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
