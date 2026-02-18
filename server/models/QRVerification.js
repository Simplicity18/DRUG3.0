const mongoose = require('mongoose');

const qrVerificationSchema = new mongoose.Schema({
  drugId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drug'
  },
  barcodeQR: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Authentic', 'Suspicious'],
    required: true
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('QRVerification', qrVerificationSchema);
