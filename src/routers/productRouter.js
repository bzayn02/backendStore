import express from 'express';
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategoryId,
} from '../model/products/productModel.js';
const router = express.Router();

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const result = await getAllProducts();
    res.json({
      status: 'success',
      message: 'Here are all the categories...',
      result,
    });
  } catch (error) {
    next(error);
  }
});

// Get product by slug

router.get('/product/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    console.log(slug);
    const result = await getProductBySlug(slug);
    result?.length
      ? res.json({
          status: 'success',
          message: 'Here the product by slug.',
          result,
        })
      : res.json({
          status: 'error',
          message: 'Unable to find the product',
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
