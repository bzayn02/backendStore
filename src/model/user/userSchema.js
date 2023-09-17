import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: 'inactive',
    },
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    dob: {
      type: Date,
      default: null,
    },
    street: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    postCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: '',
    },
    refreshJWT: {
      type: String,
      default: '',
    },
    profileImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
