const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

const register = async (req, res, next) => {
    try {
        const { username, email, password, name, phone } = req.body;

        const existingEmail = UserModel.findByEmail(email);
        if (existingEmail) {
            return next(new AppError('Email already registered', 409));
        }

        const existingUsername = UserModel.findByUsername(username);
        if (existingUsername) {
            return next(new AppError('Username already taken', 409));
        }

        const newUser = UserModel.create({
            username,
            email,
            password,
            name: name || username,
            phone: phone || null,
            role: 'user'
        });

        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: newUser
        });
    } catch (error) {
        next(new AppError('Registration failed', 500));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = UserModel.findByEmail(email);
        if (!user) {
            return next(new AppError('Invalid credentials', 401));
        }

        const isValidPassword = UserModel.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return next(new AppError('Invalid credentials', 401));
        }

        if (!user.isActive) {
            return next(new AppError('Account is deactivated', 403));
        }

        const token = generateToken(user);
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        next(new AppError('Login failed', 500));
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = UserModel.findById(req.user.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(new AppError('Failed to fetch profile', 500));
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, avatar } = req.body;
        const userId = req.user.id;

        const updatedUser = UserModel.update(userId, {
            name: name || req.user.name,
            phone: phone || req.user.phone,
            avatar: avatar || req.user.avatar
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(new AppError('Failed to update profile', 500));
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile
};
