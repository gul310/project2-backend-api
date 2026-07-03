@"
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', protect, authController.getMe);
router.put('/update-profile', protect, authController.updateProfile);

module.exports = router;
"@ | Out-File -Encoding UTF8 backend\routes\authRoutes.js