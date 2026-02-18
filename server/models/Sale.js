const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
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
  quantitySold: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

saleSchema.index({ date: -1 });
saleSchema.index({ drugId: 1, date: -1 });

module.exports = mongoose.model('Sale', saleSchema);
