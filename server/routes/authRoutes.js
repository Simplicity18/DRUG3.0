const express = require('express');
const { body } = require('express-validator');
const { login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], login);

router.get('/profile', protect, getProfile);

module.exports = router;
