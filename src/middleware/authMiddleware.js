import {
  createAccessJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
} from '../helpers/jwt.js';
import { getOneUser, getUserByEmail } from '../model/user/userModel.js';

export const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(authorization, 'from auth');
    const decoded = verifyAccessJWT(authorization);
    if (decoded?.email) {
      const user = await getUserByEmail(decoded?.email);
      console.log(user, 'from auth');
      if (user?._id && user?.status === 'active') {
        user.refreshJWT = undefined;
        req.userInfo = user;
        return next();
      }
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized...',
    });
  } catch (error) {
    if (error.message.includes('jwt expired')) {
      error.statusCode = 403;
      error.message = error.message;
    }
    if (error.message.includes('invalid signature')) {
      error.statusCode = 401;
      error.message = error.message;
    }
    next(error);
  }
};

export const refreshAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // 2. Decode JWT
    // 2. a. Check token exists in database

    const decoded = verifyRefreshJWT(authorization);
    // 2.a. Make sure token exists in database

    // 3. Extract email and get user by email
    // 4. Check if user is active
    if (decoded?.email) {
      const user = await getOneUser({
        email: decoded.email,
        refreshJWT: authorization,
      });
      console.log(user, 'from refresh auth');

      if (user?._id && user?.status === 'active') {
        // create new accessJWT
        const accessJWT = await createAccessJWT(decoded?.email);

        return res.json({
          status: 'success',
          accessJWT,
        });
      }
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized...',
    });
  } catch (error) {
    next(error);
  }
};
