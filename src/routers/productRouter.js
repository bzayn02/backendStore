import express from 'express';
import {
  getAllProducts,
  getProductsByCategoryId,
} from '../model/products/productModel.js';
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

router.get('/categories/:slug/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const result = await getProductsByCategoryId(_id);
    console.log('products', result);
    result.length
      ? res.json({
          status: 'success',
          message: 'Here are all the products for the category',
          result,
        })
      : res.json({
          status: 'success',
          message: 'Here are all the products for the category',
        });
  } catch (error) {
    next(error);
  }
});

export default router;
