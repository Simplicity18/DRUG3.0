const Drug = require('../models/Drug');
const Sale = require('../models/Sale');
const StockMovement = require('../models/StockMovement');
const { stringify } = require('csv-stringify/sync');

exports.getStockReport = async (req, res) => {
  try {
    const drugs = await Drug.find().sort({ name: 1 });
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStockMovementHistory = async (req, res) => {
  try {
    const { drugId, limit = 100 } = req.query;
    let query = {};
    if (drugId) query.drugId = drugId;
    
    const movements = await StockMovement.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .populate('drugId', 'name batchNumber');
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.exportToCSV = async (req, res) => {
  try {
    const drugs = await Drug.find().sort({ name: 1 }).lean();
    const csvData = drugs.map(d => ({
      Name: d.name,
      'Batch Number': d.batchNumber,
      Manufacturer: d.manufacturer,
      'Expiry Date': d.expiryDate?.toISOString().split('T')[0],
      Quantity: d.quantity,
      'Cost Price': d.costPrice,
      'Selling Price': d.sellingPrice,
      'Reorder Level': d.reorderLevel
    }));
    
    const csv = stringify(csvData, { header: true });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
