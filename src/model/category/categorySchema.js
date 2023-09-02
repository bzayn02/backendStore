import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
    },
    title: {
      type: String,
    },

    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
