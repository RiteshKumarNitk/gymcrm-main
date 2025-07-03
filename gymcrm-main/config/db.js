const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gymcrm'
    );
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    logger.error(`❌ FATAL MongoDB Connection Error: ${err.message}`);
    logger.error('Diagnostics:');
    logger.error(`1. Attempted connection to: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gymcrm'}`);
    logger.error('2. Is MongoDB running? Try:');
    logger.error('   - On Mac/Linux: run "mongod" in terminal');
    logger.error('   - On Windows: check Services for "MongoDB Server"');
    logger.error('3. If using MongoDB Atlas:');
    logger.error('   - Check your connection string');
    logger.error('   - Whitelist your IP address');
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;

// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//     });
//     console.log("✅ MongoDB connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed", error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
