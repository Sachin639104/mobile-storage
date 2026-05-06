//const mongoose = require('mongoose');
import mongoose from "mongoose";
import dotenv from "dotenv";
 dotenv.config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s if can't find server
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

//module.exports = connectDB;
export default connectDB