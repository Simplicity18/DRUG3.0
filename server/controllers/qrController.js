const Drug = require('../models/Drug');
const QRVerification = require('../models/QRVerification');

// Placeholder simulation - in production would integrate with actual verification API
exports.verifyQR = async (req, res) => {
  try {
    const { barcodeQR } = req.body;
    if (!barcodeQR) {
      return res.status(400).json({ message: 'Barcode/QR code is required' });
    }

    const drug = await Drug.findOne({ barcodeQR });
    // Simulation: If drug exists in DB = Authentic, else 10% chance Suspicious for demo
    let status = drug ? 'Authentic' : (Math.random() < 0.1 ? 'Suspicious' : 'Authentic');
    
    await QRVerification.create({
      drugId: drug?._id,
      barcodeQR,
      status,
      verifiedBy: req.user?._id
    });

    res.json({
      barcodeQR,
      status,
      drugInfo: drug ? { name: drug.name, batchNumber: drug.batchNumber, manufacturer: drug.manufacturer } : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
