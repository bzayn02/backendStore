import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    status: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    name: { type: String },
    parentCat: {
      type: mongoose.Types.ObjectId,
      ref: 'CategoryID',
    },
    slug: {
      type: String,
      index: 1,
    },
    price: { type: Number },
    salesPrice: { type: Number },
    qty: {
      type: Number,
    },
    salesEndDate: {
      type: String,
    },
    salesStartDate: {
      type: String,
    },
    sku: { type: String },
    description: {
      type: String,
    },
    thumbnail: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model('Product', productSchema);
