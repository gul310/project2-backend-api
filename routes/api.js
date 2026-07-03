@"
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateId } = require('../middleware/validation');
const { protect, adminOnly, isOwnerOrAdmin } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.status(200).json({
        name: 'NovaAI API',
        version: '1.0.0',
        status: 'active',
        endpoints: {
            'GET /api/users': 'Get all users (Admin only)',
            'GET /api/users/:id': 'Get user by ID (Admin/Owner)',
            'POST /api/users': 'Create new user (Admin only)',
            'PUT /api/users/:id': 'Update user (Admin/Owner)',
            'DELETE /api/users/:id': 'Delete user (Admin only)',
            'POST /api/auth/register': 'Register new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/auth/me': 'Get current user profile',
            'PUT /api/auth/update-profile': 'Update user profile'
        }
    });
});

router.get('/users', protect, adminOnly, userController.getAllUsers);
router.get('/users/:id', protect, validateId, isOwnerOrAdmin, userController.getUserById);
router.post('/users', protect, adminOnly, validateUser, userController.createUser);
router.put('/users/:id', protect, validateId, isOwnerOrAdmin, validateUser, userController.updateUser);
router.delete('/users/:id', protect, validateId, adminOnly, userController.deleteUser);

module.exports = router;
"@ | Out-File -Encoding UTF8 backend\routes\api.js