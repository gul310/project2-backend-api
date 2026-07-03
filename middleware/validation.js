const validateUser = (req, res, next) => {
    const { name, email, phone, role } = req.body;
    const errors = [];

    // For PUT requests, only validate fields that are provided
    const isUpdate = req.method === 'PUT';

    if (!isUpdate) {
        // For POST requests, validate all required fields
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.push('Valid email address is required');
        }
    } else {
        // For PUT requests, validate only if fields are provided
        if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
            errors.push('Name must be at least 2 characters long');
        }

        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('Valid email address is required');
            }
        }
    }

    if (phone) {
        const phoneRegex = /^\+?[\d\s-]{10,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            errors.push('Invalid phone number format');
        }
    }

    const validRoles = ['admin', 'user', 'guest', 'moderator'];
    if (role && !validRoles.includes(role)) {
        errors.push('Role must be one of: ' + validRoles.join(', '));
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    // Sanitize input
    if (name) req.body.name = name.trim();
    if (email) req.body.email = email.toLowerCase().trim();
    if (phone) req.body.phone = phone.trim();

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');

    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Invalid email format');
        }
    }

    if (password && password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    req.body.email = email.toLowerCase().trim();
    next();
};

const validateRegister = (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;
    const errors = [];

    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < 8) {
        errors.push('Password must be at least 8 characters');
    } else {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUppercase) errors.push('Password must contain at least one uppercase letter');
        if (!hasLowercase) errors.push('Password must contain at least one lowercase letter');
        if (!hasNumber) errors.push('Password must contain at least one number');
        if (!hasSpecial) errors.push('Password must contain at least one special character');
    }

    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors
        });
    }

    req.body.email = email.toLowerCase().trim();
    next();
};

const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        return res.status(400).json({
            success: false,
            error: 'Invalid user ID'
        });
    }
    req.params.id = id;
    next();
};

module.exports = {
    validateUser,
    validateLogin,
    validateRegister,
    validateId
};
