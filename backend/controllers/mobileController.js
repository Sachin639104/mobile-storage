//const Mobile = require('../models/Mobile');
//const Receipt = require('../models/Receipt');
import Mobile from '../models/Mobile.js'
import Receipt from '../models/Receipt.js'
const getMobiles = async (req, res) => {
  try {
    const mobiles = await Mobile.find().sort({ createdAt: -1 });
    res.status(200).json(mobiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  
const addMobile = async (req, res) => {
  try {
    const { modelName, brand, price, stockQuantity } = req.body

  
    // Pehle check karo same mobile hai kya
    const existing = await Mobile.findOne({ 
      modelName: { $regex: new RegExp(`^${modelName}$`, 'i') },
      brand: { $regex: new RegExp(`^${brand}$`, 'i') }
    })

    if (existing) {
      // Already hai toh sirf quantity update karo
      const updated = await Mobile.findByIdAndUpdate(
        existing._id,
        { $inc: { stockQuantity: stockQuantity } },
        { new: true }
      )
      return res.status(200).json(updated)
    }

    // Naya mobile banao
    const mobile = await Mobile.create(req.body)
    res.status(201).json(mobile)

  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const processSale = async (req, res) => {
  try {
    const { id } = req.params
    let { customerName, customerPhone, customerAddress, discount, gst, paymentMode } = req.body
    
    const cleanPhone = customerPhone.toString().trim()
    if (!/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits." })
    }

    const updatedMobile = await Mobile.findOneAndUpdate(
      { _id: id, stockQuantity: { $gt: 0 } },
      { $inc: { stockQuantity: -1 } },
      { new: true }
    )

    if (!updatedMobile) return res.status(400).json({ message: "Asset out of stock" })

    const guaranteeDate = new Date()
    guaranteeDate.setFullYear(guaranteeDate.getFullYear() + 1)

    // Total calculate karo
    const price = updatedMobile.price
    const discountAmt = (price * (discount || 0)) / 100
    const afterDiscount = price - discountAmt
    const gstAmt = (afterDiscount * (gst || 0)) / 100
    const totalPaid = afterDiscount + gstAmt

    const newReceipt = await Receipt.create({
      receiptId: `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      customerName,
      customerPhone: cleanPhone,
      customerAddress,
      modelName: updatedMobile.modelName,
      pricePaid: updatedMobile.price,
      discount: discount || 0,
      gst: gst || 0,
      totalPaid,
      paymentMode,
      guaranteeUntil: guaranteeDate
    })

    res.status(200).json({ receipt: newReceipt, updatedMobile })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
    

const deleteMobile = async (req, res) => {
  try {
    await Mobile.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export  { getMobiles, addMobile, deleteMobile, processSale };