require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

const app = express();
app.set('trust proxy', 1);
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Origin is not allowed by CORS.'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income', incomeRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/budget', budgetRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((error, _req, res, _next) => {
    if (error instanceof require('multer').MulterError) {
        return res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ message: 'The uploaded file is invalid or too large.' });
    }
    if (error.message === 'Origin is not allowed by CORS.') return res.status(403).json({ message: 'Request origin is not allowed.' });
    console.error('Request failed:', error.message);
    return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

const startServer = async () => {
    if (!process.env.MONGO_URL || !process.env.JWT_SECRET) throw new Error('MONGO_URL and JWT_SECRET must be configured.');
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API listening on port ${port}`));
};

if (require.main === module) {
    startServer().catch((error) => {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    });
}

module.exports = app;
