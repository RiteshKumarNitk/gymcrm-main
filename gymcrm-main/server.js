require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const logger = require('./config/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - Use only one connection method
connectDB(); // This should handle the connection (remove the mongoose.connect() below)

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./middleware/authMiddleware'), userRoutes);
app.use('/api/business', require('./middleware/authMiddleware'), businessRoutes);
app.use('/api/dashboard', require('./middleware/authMiddleware'), dashboardRoutes);
app.use('/api/memberships', require('./middleware/authMiddleware'), membershipRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/debug', (req, res) => {
  res.json({
    status: 'Server is running',
    mongoUri: process.env.MONGO_URI,
    mongooseState: mongoose.connection.readyState,
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  });
});
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});


// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();

// // Load routes
// const businessRoutes = require("./routes/businessRoutes");
// const userRoutes = require("./routes/userRoutes"); // ✅ Required for /api/users

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Route handlers
// app.use("/api/business", businessRoutes);
// app.use("/api/users", userRoutes); // ✅ NEW

// // Server start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
