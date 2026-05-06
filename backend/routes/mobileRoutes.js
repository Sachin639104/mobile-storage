//const express = require('express');
import express from 'express';
const router = express.Router();
import { getMobiles, addMobile, deleteMobile, processSale } from '../controllers/mobileController.js';
import Mobile from '../models/Mobile.js';
import Receipt from '../models/Receipt.js';

router.route('/').get(getMobiles).post(addMobile);
router.post('/buy/:id', processSale);
router.delete('/:id', deleteMobile);


router.patch('/:id/stock', async (req, res) => {
  const updated = await Mobile.findByIdAndUpdate(
    req.params.id,
    { 
      $inc: { stockQuantity: req.body.quantity },
      $set: { price: req.body.price }
    },
    { new: true }
  )
  res.json(updated)
})


router.get('/receipts', async (req, res) => {
  const receipts = await Receipt.find().sort({ purchaseDate: -1 })
  res.json(receipts)
})


router.patch('/:id/return', async (req, res) => {
  try {
    const { status, reason } = req.body
    
    // Receipt update karo
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    
    // Agar return hai toh stock wapas add karo
    if (status === 'returned') {
      await Mobile.findOneAndUpdate(
        { modelName: receipt.modelName },
        { $inc: { stockQuantity: 1 } }
      )
    }
    
    res.json({ success: true, receipt })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

//module.exports = router;
export default router