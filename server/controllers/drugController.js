const Drug = require('../models/Drug');
const Sale = require('../models/Sale');
const StockMovement = require('../models/StockMovement');
const { validationResult } = require('express-validator');

exports.getDrugs = async (req, res) => {
  try {
    const { search, expiry, lowStock, manufacturer, batchNumber, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (expiry === 'soon') {
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      query.expiryDate = { $lte: thirtyDays, $gte: new Date() };
    } else if (expiry === 'expired') {
      query.expiryDate = { $lt: new Date() };
    }
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$reorderLevel'] };
    }
    if (manufacturer) {
      query.manufacturer = { $regex: manufacturer, $options: 'i' };
    }
    if (batchNumber) {
      query.batchNumber = { $regex: batchNumber, $options: 'i' };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'expiry') sortOption = { expiryDate: 1 };
    else if (sort === 'name') sortOption = { name: 1 };
    else if (sort === 'quantity') sortOption = { quantity: 1 };

    const drugs = await Drug.find(query).sort(sortOption);
    res.json(drugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDrugById = async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    res.json(drug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDrug = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const drug = await Drug.create(req.body);
    await StockMovement.create({
      drugId: drug._id,
      drugName: drug.name,
      batchNumber: drug.batchNumber,
      type: 'IN',
      quantity: drug.quantity,
      previousQuantity: 0,
      newQuantity: drug.quantity,
      reference: 'Initial stock',
      performedBy: req.user?._id
    });
    res.status(201).json(drug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDrug = async (req, res) => {
  try {
    const drug = await Drug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    res.json(drug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteDrug = async (req, res) => {
  try {
    const drug = await Drug.findByIdAndDelete(req.params.id);
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    res.json({ message: 'Drug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sellDrug = async (req, res) => {
  try {
    const { drugId, quantity, useFIFO } = req.body;
    const drug = await Drug.findById(drugId);
    if (!drug) return res.status(404).json({ message: 'Drug not found' });
    if (drug.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const previousQuantity = drug.quantity;
    drug.quantity -= quantity;
    await drug.save();

    const totalAmount = quantity * drug.sellingPrice;
    await Sale.create({
      drugId: drug._id,
      drugName: drug.name,
      batchNumber: drug.batchNumber,
      quantitySold: quantity,
      totalAmount,
      soldBy: req.user?._id
    });

    await StockMovement.create({
      drugId: drug._id,
      drugName: drug.name,
      batchNumber: drug.batchNumber,
      type: 'SALE',
      quantity: -quantity,
      previousQuantity,
      newQuantity: drug.quantity,
      reference: `Sale (${useFIFO ? 'FIFO' : 'FEFO'})`,
      performedBy: req.user?._id
    });

    res.json({
      message: 'Sale recorded successfully',
      sale: { drugName: drug.name, quantitySold: quantity, totalAmount }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
