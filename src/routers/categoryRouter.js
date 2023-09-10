import express from 'express';
import { getCategories } from '../model/category/categoryModel.js';
const router = express.Router();

router.get('/categories', async (req, res, next) => {
  try {
    const result = await getCategories();
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
