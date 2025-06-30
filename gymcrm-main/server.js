const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// Load routes
const businessRoutes = require("./routes/businessRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Required for /api/users

// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use("/api/business", businessRoutes);
app.use("/api/users", userRoutes); // ✅ NEW

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
