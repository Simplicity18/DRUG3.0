const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  batchNumber: {
    type: String,
    required: true,
    trim: true
  },
  manufacturer: {
    type: String,
    required: true,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0
  },
  barcodeQR: {
    type: String,
    default: '',
    trim: true
  },
  batches: [{
    batchNumber: String,
    quantity: Number,
    expiryDate: Date,
    costPrice: Number,
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

drugSchema.index({ name: 'text', manufacturer: 'text', batchNumber: 'text' });
drugSchema.index({ expiryDate: 1 });
drugSchema.index({ quantity: 1 });

module.exports = mongoose.model('Drug', drugSchema);
