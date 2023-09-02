import ProductSchema from './productSchema.js';

export const getAllProducts = () => {
  return ProductSchema.find();
};
