@"
const errorHandler = (err, req, res, next) => {
    console.error('❌ ERROR:', err.message);
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';

    const response = {
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack
        })
    };

    res.status(statusCode).json(response);
};

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { errorHandler, AppError };
"@ | Out-File -Encoding UTF8 backend\middleware\errorHandler.js