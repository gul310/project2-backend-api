@"
const UserModel = require('../models/userModel');
const { AppError } = require('../middleware/errorHandler');

const getAllUsers = async (req, res, next) => {
    try {
        const users = UserModel.findAll();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(new AppError('Failed to fetch users', 500));
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = UserModel.findById(req.params.id);
        if (!user) {
            return next(new AppError(`User with ID \${req.params.id} not found`, 404));
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(new AppError('Failed to fetch user', 500));
    }
};

const createUser = async (req, res, next) => {
    try {
        const { name, email, phone, role = 'user', username, password } = req.body;

        const existingEmail = UserModel.findByEmail(email);
        if (existingEmail) {
            return next(new AppError('Email already registered', 409));
        }

        const existingUsername = UserModel.findByUsername(username);
        if (existingUsername) {
            return next(new AppError('Username already taken', 409));
        }

        const newUser = UserModel.create({
            name,
            email,
            phone,
            role,
            username,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        next(new AppError('Failed to create user', 500));
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { name, email, phone, role, isActive } = req.body;
        const userId = req.params.id;

        const existingUser = UserModel.findById(userId);
        if (!existingUser) {
            return next(new AppError(`User with ID \${userId} not found`, 404));
        }

        if (email && email !== existingUser.email) {
            const emailExists = UserModel.findByEmail(email);
            if (emailExists) {
                return next(new AppError('Email already registered', 409));
            }
        }

        const updatedUser = UserModel.update(userId, {
            name: name || existingUser.name,
            email: email || existingUser.email,
            phone: phone || existingUser.phone,
            role: role || existingUser.role,
            isActive: isActive !== undefined ? isActive : existingUser.isActive
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(new AppError('Failed to update user', 500));
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        const existingUser = UserModel.findById(userId);
        if (!existingUser) {
            return next(new AppError(`User with ID \${userId} not found`, 404));
        }

        if (req.user.id === userId && req.user.role === 'admin') {
            return next(new AppError('Cannot delete your own admin account', 400));
        }

        UserModel.delete(userId);
        res.status(204).send();
    } catch (error) {
        next(new AppError('Failed to delete user', 500));
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
"@ | Out-File -Encoding UTF8 backend\controllers\userController.js