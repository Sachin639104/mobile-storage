//const mongoose = require('mongoose');
import mongoose from "mongoose";
const receiptSchema = new mongoose.Schema({
  receiptId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  modelName: { type: String, required: true },
  pricePaid: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  guaranteeUntil: { type: Date, required: true },

discount: { type: Number, default: 0 },
gst: { type: Number, default: 0 },
totalPaid: { type: Number, required: true },
paymentMode: { type: String, enum: ['Cash', 'Online', 'Card'], required: true },

status:{type: String, enum: ['sold', 'returned', 'exchanged'], default:'sold'}
});

//module.exports = mongoose.model('Receipt', receiptSchema);
export default mongoose.model('Receipt', receiptSchema)