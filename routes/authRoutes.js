const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middlewares/validate');

// The Routes
// URL: POST /auth/register
router.post('/register',  validateRegister, authController.register);

// URL: POST /auth/login
router.post('/login', validateLogin , authController.login);

module.exports = router;