const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const projectRoutes = require('./routes/project.routes');
const contactRoutes = require('./routes/contact.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const quoteRoutes = require('./routes/quote.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const timeRoutes = require('./routes/time.routes');
const payrollRoutes = require('./routes/payroll.routes');
const expenseRoutes = require('./routes/expense.routes');
const reportRoutes = require('./routes/report.routes');
const emailRoutes = require('./routes/email.routes');
const organizationRoutes = require('./routes/organization.routes');
const webhookRoutes = require('./routes/webhook.routes');

const { errorHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - UPDATED TO ALLOW PRODUCTION FRONTEND
const allowedOrigins = [
  'http://localhost:3000',
  'https://projectsuitepro.com',
  'https://www.projectsuitepro.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/time-entries', timeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Project Suite Pro API running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

module.exports = app;
