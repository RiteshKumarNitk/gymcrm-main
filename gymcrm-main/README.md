# 🏋️ GymCRM - Complete SAAS Gym Management System

A comprehensive, enterprise-ready gym management platform built with Node.js, Express, and MongoDB. This system provides everything needed to run multiple gym businesses with subscription management, class scheduling, equipment tracking, and much more.

## 🚀 Key Features

### 🏢 **Multi-Tenant SAAS Architecture**
- **Super Admin**: Platform-wide control and business oversight
- **Gym Admin**: Complete gym management and business operations
- **Trainers**: Class management, member training, and scheduling
- **Members**: Booking, workouts, progress tracking, and payments

### 💳 **Subscription Management**
- Multiple subscription tiers (Trial, Basic, Premium, Enterprise)
- Stripe integration for secure payments
- Automatic billing and renewal
- Usage limits and feature controls
- Subscription analytics and reporting

### 👥 **User Management**
- Firebase authentication integration
- Role-based access control (RBAC)
- Detailed user profiles with medical information
- Trainer certifications and specializations
- Member fitness tracking and goals

### 🏃‍♀️ **Class & Session Management**
- Flexible class scheduling with recurring patterns
- Real-time booking and waitlist management
- Attendance tracking and check-ins
- Class ratings and feedback system
- Room and resource allocation

### 💪 **Workout & Exercise Management**
- Custom exercise library with video/image support
- Personalized workout plans and templates
- Progress tracking and analytics
- Workout logging with detailed metrics
- Exercise recommendations based on goals

### 🛠️ **Equipment Management**
- Complete equipment inventory tracking
- Maintenance scheduling and logging
- Equipment booking and usage analytics
- QR code integration for easy access
- Condition monitoring and alerts

### 💰 **Payment & Financial Management**
- Multiple payment methods support
- Automated invoicing and receipts
- Membership plan management
- Revenue tracking and analytics
- Refund and payment dispute handling

### 📊 **Analytics & Reporting**
- Real-time business dashboards
- Member engagement analytics
- Financial reporting and insights
- Equipment utilization reports
- Trainer performance metrics

### 🔔 **Notification System**
- Email, SMS, and push notifications
- Class reminders and booking confirmations
- Payment due alerts
- Equipment maintenance notifications
- Custom notification preferences

### 🔒 **Security & Performance**
- Rate limiting and API protection
- Data encryption and secure storage
- Regular security audits
- Performance monitoring
- Automated backups

## 🏗️ **System Architecture**

### **Database Models**
```
📁 models/
├── 👤 user.js              # Users with roles and profiles
├── 🏢 business.js          # Gym businesses with subscriptions
├── 🎫 membership.js        # Membership plans and subscriptions
├── ✅ checkin.js           # Member check-ins
├── 🏃‍♀️ class.js            # Classes, sessions, and bookings
├── 💪 workout.js           # Exercises, workouts, and logs
├── 🛠️ equipment.js         # Equipment and maintenance
└── 💳 payment.js           # Payments, invoices, and plans
```

### **API Endpoints**

#### **Authentication & Users**
```
POST   /api/auth/register          # Register/update user
GET    /api/auth/me               # Get current user profile
GET    /api/users                 # Get all users (admin)
GET    /api/users/business/:id    # Get users by business
```

#### **Business Management**
```
POST   /api/business              # Create business
GET    /api/business              # Get all businesses
PUT    /api/business/:id          # Update business
GET    /api/business/:id/stats    # Business analytics
```

#### **Subscription Management**
```
GET    /api/subscriptions/plans   # Get subscription plans
POST   /api/subscriptions/subscribe # Subscribe to plan
GET    /api/subscriptions/current # Current subscription
DELETE /api/subscriptions/cancel  # Cancel subscription
```

#### **Class Management**
```
POST   /api/classes/types         # Create class type
GET    /api/classes/types         # Get class types
POST   /api/classes/sessions      # Schedule class session
GET    /api/classes/sessions      # Get sessions
POST   /api/classes/book          # Book a class
DELETE /api/classes/cancel        # Cancel booking
```

#### **Workout Management**
```
POST   /api/workouts              # Create workout
GET    /api/workouts              # Get workouts
POST   /api/workouts/log          # Log workout
GET    /api/workouts/logs         # Get workout logs
GET    /api/exercises             # Get exercise library
```

#### **Equipment Management**
```
POST   /api/equipment             # Add equipment
GET    /api/equipment             # Get equipment list
POST   /api/equipment/book        # Book equipment
GET    /api/equipment/maintenance # Maintenance logs
```

#### **Payment Management**
```
POST   /api/payments              # Process payment
GET    /api/payments              # Payment history
POST   /api/invoices              # Create invoice
GET    /api/invoices              # Get invoices
```

#### **Analytics**
```
GET    /api/dashboard/admin       # Admin dashboard
GET    /api/dashboard/member      # Member dashboard
GET    /api/analytics/revenue     # Revenue analytics
GET    /api/analytics/members     # Member analytics
```

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js (v14+)
- MongoDB (v4.4+)
- Firebase account
- Stripe account (for payments)

### **Environment Variables**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/gymcrm

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5000000
```

### **Installation Steps**
```bash
# Clone repository
git clone https://github.com/your-repo/gymcrm-main.git
cd gymcrm-main/gymcrm-main

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Or start production server
npm start
```

## 📋 **SAAS Business Model**

### **Subscription Tiers**

#### **🆓 Trial (14 days free)**
- Up to 50 members
- 2 trainers
- Basic features
- Email support

#### **💼 Basic ($29/month)**
- Up to 200 members
- 5 trainers
- Class scheduling
- Basic analytics
- Email & chat support

#### **⭐ Premium ($79/month)**
- Up to 500 members
- 15 trainers
- Advanced analytics
- Equipment management
- Custom branding
- Priority support

#### **🏢 Enterprise ($199/month)**
- Unlimited members
- Unlimited trainers
- Multiple locations
- White-label solution
- Custom integrations
- Dedicated support

### **Revenue Streams**
1. **Monthly/Annual Subscriptions**: Primary revenue source
2. **Setup Fees**: One-time onboarding charges
3. **Premium Features**: Add-on services and features
4. **Payment Processing**: Small percentage on transactions
5. **Professional Services**: Custom development and consulting

## 🔧 **Development**

### **Project Structure**
```
gymcrm-main/
├── 📁 config/          # Database and app configuration
├── 📁 controllers/     # Business logic and API handlers
├── 📁 middleware/      # Authentication, validation, etc.
├── 📁 models/          # Database schemas and models
├── 📁 routes/          # API route definitions
├── 📁 utils/           # Helper functions and utilities
├── 📁 validations/     # Request validation schemas
├── 📁 uploads/         # File upload directory
├── 🔧 server.js        # Main application entry point
├── 📦 package.json     # Dependencies and scripts
└── 📚 README.md        # This file
```

### **Key Technologies**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **Payments**: Stripe API
- **Email**: Nodemailer
- **Validation**: Joi, Express-validator
- **Security**: Helmet, Rate limiting
- **File Upload**: Multer
- **Logging**: Winston
- **Task Scheduling**: Node-cron

### **API Documentation**
Full API documentation is available at `/api-docs` when the server is running (Swagger/OpenAPI).

## 🚦 **Getting Started Guide**

### **For Super Admin**
1. Create your super admin account
2. Set up subscription plans
3. Monitor platform metrics
4. Manage business approvals

### **For Gym Owners**
1. Register your gym business
2. Choose a subscription plan
3. Set up gym details and operating hours
4. Add trainers and staff
5. Create membership plans
6. Configure class schedules

### **For Trainers**
1. Complete your trainer profile
2. Add certifications and specializations
3. Set your availability
4. Create workout plans
5. Schedule classes

### **For Members**
1. Register and complete your profile
2. Choose a membership plan
3. Book classes and personal training
4. Track your workouts and progress
5. Make payments and manage subscriptions

## 🔐 **Security Features**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting to prevent abuse
- Secure password hashing
- JWT token authentication
- Role-based access control
- Data encryption at rest and in transit

## 📈 **Scalability**
- Horizontal scaling with load balancers
- Database clustering and replication
- CDN integration for static assets
- Microservices architecture ready
- Container deployment (Docker)
- Cloud hosting support (AWS, GCP, Azure)

## 🤝 **Contributing**
We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 **License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**
- 📧 Email: support@gymcrm.com
- 💬 Chat: Available in the admin dashboard
- 📚 Documentation: [docs.gymcrm.com](https://docs.gymcrm.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/gymcrm-main/issues)

## 🎯 **Roadmap**
- [ ] Mobile app development (React Native)
- [ ] IoT equipment integration
- [ ] AI-powered workout recommendations
- [ ] Nutrition tracking and meal plans
- [ ] Social features and community building
- [ ] Advanced reporting and business intelligence
- [ ] Multi-language support
- [ ] Franchise management features

---
**Built with ❤️ for the fitness industry**
