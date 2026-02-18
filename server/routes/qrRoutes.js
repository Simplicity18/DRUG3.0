const express = require('express');
const { verifyQR } = require('../controllers/qrController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.post('/verify', verifyQR);
