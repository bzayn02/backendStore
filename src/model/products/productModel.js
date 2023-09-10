import ProductSchema from './productSchema.js';

export const getAllProducts = () => {
  return ProductSchema.find();
};

export const getProductsByCategoryId = (parentCat = categoryId) => {
  return ProductSchema.find({ parentCat });
};

export const getProductBySlug = (slug) => {
  return ProductSchema.find({ slug });
};
