import express from 'express';
import { getAllActivePaymentOptions } from '../model/paymentOptions/paymentOptionsModel.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const paymentOptions = await getAllActivePaymentOptions();
    console.log(paymentOptions);
    res.json({
      status: 'success',
      message: 'All the payment options are here.',
      paymentOptions,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
