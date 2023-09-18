import express from 'express';

import multer from 'multer';
import {
  getUserByEmail,
  insertUser,
  updateUserById,
  updateVerifyUser,
} from '../model/user/userModel.js';
import {
  loginValidation,
  newUserValidation,
  newUserVerificationValidation,
} from '../middleware/joiValidation.js';
import { comparePassword, hashPassword } from '../helpers/bcrypt.js';
import { v4 as uuidv4 } from 'uuid';
import {
  accountVerificationEmail,
  accountVerifiedNotification,
} from '../helpers/nodemailer.js';
import { createAccessJWT, createRefreshJWT } from '../helpers/jwt.js';
import { auth, refreshAuth } from '../middleware/authMiddleware.js';
import { deleteSession } from '../model/session/sessionModel.js';

const router = express.Router();

const imgFolderPath = 'public/img/profile';

// Multer setup

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let error = null;
    cb(error, imgFolderPath);
  },
  filename: (req, file, cb) => {
    let error = null;

    const fullFileName = Date.now() + '-' + file.originalname;
    console.log(file.mimetype);
    cb(error, fullFileName);
  },
});

const upload = multer({ storage });

// ================ Get user details
router.get('/', auth, (req, res, next) => {
  try {
    req.userInfo.password = undefined;
    res.json({
      status: 'success',
      message: 'Here is the user info.',
      user: req.userInfo,
    });
  } catch (error) {
    next(error);
  }
});

// ================ User Registration
router.post(
  '/',
  upload.single('profileImg'),
  newUserValidation,
  async (req, res, next) => {
    try {
      req.file
        ? (req.body.profileImg = req.file.path)
        : (req.body.profileImg = '');
      const { password } = req.body;
      req.body.password = hashPassword(password);
      req.body.verificationCode = uuidv4();

      const result = await insertUser(req.body);
      console.log(result);
      if (result?._id) {
        const verificationCode = result.verificationCode;
        const email = result.email;
        const link = `${process.env.WEB_DOMAIN}/user-verification?code=${verificationCode}&email=${result.email}`;
        await accountVerificationEmail({
          fname: result.fname,
          email,
          link,
        });
        res.json({
          status: 'success',
          message:
            'Please check your email and follow instructions to activate the account.',
          result,
        });
      }
      return res.json({
        status: 'error',
        message: 'Unable to create account. Please try again later.',
      });
    } catch (error) {
      if (error.message.includes('E11000 duplicate key error collection')) {
        error.statusCode = 400;
        error.message =
          'The user email is already related to other user. Please use another one.';
      }
      next(error);
    }
  }
);

// ================ Account Verification
router.post(
  '/user-verification',
  newUserVerificationValidation,
  async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const filter = { email, verificationCode: code };
      const updateObj = {
        isVerified: true,
        verificationCode: '',
        status: 'active',
      };
      const result = await updateVerifyUser(filter, updateObj);

      if (result?._id) {
        await accountVerifiedNotification(result);
        res.json({
          status: 'success',
          message: 'Your account has been verified. You may login now.',
        });
        return res.json({
          status: 'error',
          message: 'Either the link is expired or invalid.',
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

// =============== Sign in
router.post('/sign-in', loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (user?._id) {
      const isMatched = comparePassword(password, user.password);
      if (isMatched) {
        const accessJWT = await createAccessJWT(email);
        const refreshJWT = await createRefreshJWT(email);
        return res.json({
          status: 'success',
          message: 'Signed in successfully.',
          token: { accessJWT, refreshJWT },
        });
      }
    }
    res.json({
      status: 'error',
      message: 'Invalid login details.',
    });
  } catch (error) {
    next(error);
  }
});

// Return refresh JWT
router.get('/get-accessjwt', refreshAuth);

// User Logout
router.post('/signout', async (req, res, next) => {
  try {
    const { accessJWT, refreshJWT, _id } = req.body;
    accessJWT && deleteSession(accessJWT);
    if (refreshJWT && _id) {
      await updateUserById({ _id, refreshJWT: '' });
    }

    res.json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
