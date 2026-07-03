@"
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX),
    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    }
});
app.use('/api', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[\${new Date().toISOString()}] \${req.method} \${req.originalUrl}`);
    next();
});

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route \${req.originalUrl} not found`
    });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', '╔══════════════════════════════════════════════════════╗');
    console.log('\x1b[36m%s\x1b[0m', '║         🚀 NovaAI Backend Server Started              ║');
    console.log('\x1b[36m%s\x1b[0m', '╠══════════════════════════════════════════════════════╣');
    console.log(`║  🌐 URL:        http://localhost:\${PORT}                          ║`);
    console.log(`║  📚 API Docs:   http://localhost:\${PORT}/api                      ║`);
    console.log(`║  💚 Health:     http://localhost:\${PORT}/health                   ║`);
    console.log('\x1b[36m%s\x1b[0m', '╚══════════════════════════════════════════════════════╝');
    console.log('\x1b[32m%s\x1b[0m', '✅ Server is ready!');
});
"@ | Out-File -Encoding UTF8 backend\server.js