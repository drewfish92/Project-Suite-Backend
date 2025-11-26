# Project Suite Pro - Backend API

> Complete backend API for Project Suite Pro, a multi-tenant SaaS platform for construction project management and accounting.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🌟 Features

- **Multi-Tenant Architecture** - Complete organization isolation for SaaS deployment
- **Authentication & Authorization** - JWT-based auth with role-based access control
- **Subscription Management** - Stripe integration with automatic billing and trial management
- **Project Management** - Track construction projects, budgets, and timelines
- **Financial Management** - Invoices, quotes, expenses, and reporting
- **Staff Scheduling** - Visual calendar-based staff assignment system
- **Time Tracking** - GPS-enabled clock in/out with location tracking
- **Payroll Processing** - Automated payroll calculations and payslip generation
- **Email Integration** - Automated emails for invoices, quotes, and notifications
- **PDF Generation** - Professional PDFs for invoices, quotes, and payslips
- **Audit Logging** - Complete activity tracking for compliance

## 🏗️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Payments**: Stripe
- **Email**: Nodemailer
- **PDF Generation**: PDFKit
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

You'll also need accounts for:

- [Stripe](https://stripe.com) - For payment processing
- Gmail account - For sending emails (or any SMTP provider)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/project-suite-backend.git
cd project-suite-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/projectsuitepro

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-64-characters
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email
SMTP_USER=noreply@projectsuitepro.com
SMTP_PASSWORD=your-gmail-app-password

# Frontend
FRONTEND_URL=http://localhost:3000
```

### 4. Set Up Database

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

(Optional) Seed sample data:

```bash
npm run prisma:seed
```

### 5. Start the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The API will be available at `http://localhost:5000`

### 6. Verify Installation

Check the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-11-23T..."
}
```

## 📚 API Documentation

### Authentication

#### Register New Organization

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "ABC Construction",
  "industry": "Construction",
  "companySize": "10-20 employees",
  "planTier": "professional"
}
```

#### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "SecurePass123!"
}
```

#### Get Current User

```bash
GET /api/auth/me
Authorization: Bearer {your-jwt-token}
```

### Protected Endpoints

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Endpoints Overview

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/health` | GET | Health check | No |
| `/api/auth/register` | POST | Register organization | No |
| `/api/auth/login` | POST | Login user | No |
| `/api/auth/verify-email` | POST | Verify email | No |
| `/api/auth/forgot-password` | POST | Request password reset | No |
| `/api/auth/reset-password` | POST | Reset password | No |
| `/api/auth/me` | GET | Get current user | Yes |
| `/api/users` | GET | List users | Yes |
| `/api/users` | POST | Create user | Yes (Admin) |
| `/api/projects` | GET | List projects | Yes |
| `/api/projects` | POST | Create project | Yes |
| `/api/invoices` | GET | List invoices | Yes |
| `/api/invoices` | POST | Create invoice | Yes |
| `/api/invoices/:id/send` | POST | Send invoice email | Yes |
| `/api/invoices/:id/pdf` | GET | Generate invoice PDF | Yes |
| `/api/schedule` | GET | Get staff schedule | Yes |
| `/api/time-entries/clock-in` | POST | Clock in | Yes |
| `/api/time-entries/clock-out` | POST | Clock out | Yes |
| `/api/payroll` | GET | List payroll records | Yes (Admin) |
| `/api/subscription` | GET | Get subscription | Yes |
| `/api/webhooks/stripe` | POST | Stripe webhook | No |

For complete API documentation, see [BACKEND_API_COMPLETE_GUIDE.md](./BACKEND_API_COMPLETE_GUIDE.md)

## 🗄️ Database Schema

The database consists of 15 main tables:

- **organizations** - Company accounts
- **users** - User accounts with roles
- **projects** - Construction projects
- **contacts** - Clients, suppliers, subcontractors
- **invoices** - Billing documents
- **invoice_items** - Invoice line items
- **quotes** - Price quotes
- **quote_items** - Quote line items
- **schedule_assignments** - Staff scheduling
- **time_entries** - Clock in/out records
- **payroll_records** - Payroll data
- **expenses** - Expense tracking
- **email_logs** - Email history
- **subscription_events** - Stripe events
- **audit_logs** - Activity tracking

View the complete schema in [prisma/schema.prisma](./prisma/schema.prisma)

### View Database with Prisma Studio

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## 🔒 Security

This API implements multiple security layers:

- **Password Hashing** - bcrypt with 10 salt rounds
- **JWT Tokens** - Signed tokens with configurable expiration
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **CORS** - Restricted to configured frontend domain
- **Helmet** - Security headers enabled
- **Input Validation** - Joi schemas on all endpoints
- **SQL Injection Prevention** - Prisma ORM parameterized queries
- **Multi-Tenancy** - Organization-level data isolation
- **Audit Logging** - All sensitive operations logged

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password for "Mail"
4. Use this password in your `.env` file as `SMTP_PASSWORD`

### Email Templates

The API sends automated emails for:

- Welcome email with verification link
- Email verification
- Password reset
- Invoice sent
- Quote sent
- Payslip delivery
- Trial reminders (7 days, 3 days before expiry)
- Payment success
- Payment failed

## 💳 Stripe Integration

### Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add keys to `.env` file

### Create Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Test Stripe Integration

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires 3D Secure: `4000 0025 0000 3155`

## 🚀 Deployment

### Railway.app (Recommended)

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add PostgreSQL database
5. Set environment variables
6. Deploy automatically

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create projectsuitepro-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set STRIPE_SECRET_KEY=sk_live_...
# ... set all other env vars

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
```

### Docker (Coming Soon)

Docker support will be added in a future release.

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📊 Monitoring & Logging

### Logs

Logs are written to:

- Console (all environments)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)

### Log Levels

- `error` - Error messages
- `warn` - Warning messages
- `info` - Informational messages (default)
- `debug` - Debug messages

Set log level in `.env`:

```env
LOG_LEVEL=debug
```

### Production Monitoring

Recommended services:

- **Error Tracking**: [Sentry](https://sentry.io)
- **Performance**: [New Relic](https://newrelic.com)
- **Uptime**: [UptimeRobot](https://uptimerobot.com)

## 🛠️ Development

### Project Structure

```
project-suite-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.js            # Sample data seeder
├── src/
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── jobs/                  # Cron jobs
├── logs/                  # Log files
├── uploads/               # File uploads
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
└── README.md             # This file
```

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data
- `npm run lint` - Run ESLint

### Code Style

This project uses ESLint for code linting. Run linter:

```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure:

- All tests pass
- Code follows the existing style
- Commit messages are clear and descriptive

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Payment processing by [Stripe](https://stripe.com/)
- Inspired by construction management needs in New Zealand and Australia

## 📞 Support

For support, email support@projectsuitepro.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Complete all API endpoints
- [ ] Add comprehensive test coverage
- [ ] Docker containerization
- [ ] GraphQL API option
- [ ] WebSocket support for real-time updates
- [ ] Mobile app API optimization
- [ ] Advanced reporting and analytics
- [ ] Integration with accounting software (Xero, QuickBooks)
- [ ] Multi-language support

## 📈 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: November 2025

---

**Made with ❤️ for the construction industry**

**© 2025 Project Suite Pro™. All rights reserved.**

