import categorySchema from './categorySchema.js';

// =========== Get all active categories ============
export const getCategories = () => {
  return categorySchema.find();
};
