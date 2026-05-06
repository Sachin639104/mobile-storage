//const mongoose = require('mongoose');
import mongoose from "mongoose";
const mobileSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  modelName: { type: String, required: true },
  storageCapacity: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
}, { timestamps: true });

//module.exports = mongoose.model('Mobile', mobileSchema);
export default  mongoose.model('Mobile', mobileSchema)