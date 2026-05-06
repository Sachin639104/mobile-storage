//const express = require('express');
//const dotenv = require('dotenv');
//const cors = require('cors');
//const connectDB = require('./config/db');
//const mobileRoutes = require('./routes/mobileRoutes');
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import  connectDB  from './config/db.js'
import mobileRoutes from './routes/mobileRoutes.js'
import authRoutes from './routes/authRoutes.js'
//const authRoutes=require('./routes/authRoutes');
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes


app.use('/api/auth', authRoutes)

app.use('/api/mobiles', mobileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));