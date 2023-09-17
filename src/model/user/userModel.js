import UserSchema from './userSchema.js';

export const insertUser = (obj) => {
  return UserSchema(obj).save();
};

// @filter and @updateObj must be object
export const updateVerifyUser = (filter, updateObj) => {
  return UserSchema.findOneAndUpdate(filter, updateObj);
};
