import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/authMiddleware.js';
import Institute from '../models/Institute.js';

const router = express.Router();

// @desc    Create a Razorpay order
// @route   POST /api/payment/orders
// @access  Private
router.post('/orders', protect, async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay keys not configured' });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      instituteId,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful and verified
      
      // Update institute consultancy income
      if (instituteId && amount) {
        await Institute.findByIdAndUpdate(instituteId, {
          $inc: { consultancyIncome: Number(amount) }
        });
      }

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
