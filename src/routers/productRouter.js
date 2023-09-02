import express from 'express';
import { getAllProducts } from '../model/products/productModel.js';
const router = express.Router();

router.get('/products', async (req, res, next) => {
  try {
    const result = await getAllProducts();
    console.log('products', result);
    res.json({
      status: 'success',
      message: 'Here are all the categories...',
      result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
