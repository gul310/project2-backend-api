const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = UserModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found'
                });
            }
            const { password, ...userWithoutPassword } = user;
            req.user = userWithoutPassword;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token provided'
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            error: 'Access denied. Admin only.'
        });
    }
};

const isOwnerOrAdmin = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if (req.user && (req.user.role === 'admin' || req.user.id === userId)) {
        next();
    } else {
        res.status(403).json({
            success: false,
            error: 'Access denied. You can only modify your own data.'
        });
    }
};

module.exports = { protect, adminOnly, isOwnerOrAdmin };
