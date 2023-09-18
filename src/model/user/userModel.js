import UserSchema from './userSchema.js';

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};

// @filter and @updateObj must be object
export const updateVerifyUser = (filter, updateObj) => {
  return UserSchema.findOneAndUpdate(filter, updateObj);
};

export const getUserByEmail = (email) => {
  return UserSchema.findOne({ email });
};

export const updateUser = (filter, updateObj) => {
  return UserSchema.findOneAndUpdate(filter, updateObj, { new: true });
};

export const getOneUser = (filter) => {
  return UserSchema.findOne(filter);
};

export const updateUserById = ({ _id, ...rest }) => {
  console.log(_id, rest, 'from model');
  return UserSchema.findByIdAndUpdate(_id, rest, { new: true });
};
