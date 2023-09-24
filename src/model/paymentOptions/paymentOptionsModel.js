import mongoose from 'mongoose';

const paymentOptions = mongoose.model('paymentOptions', {});

export const getAllActivePaymentOptions = () => {
  return paymentOptions.find({ status: 'active' });
};
