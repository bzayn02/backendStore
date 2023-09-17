import express from 'express';

import multer from 'multer';
import { insertUser, updateVerifyUser } from '../model/user/userModel.js';
import {
  newUserValidation,
  newUserVerificationValidation,
} from '../middleware/joiValidation.js';
import { hashPassword } from '../helpers/bcrypt.js';
import { v4 as uuidv4 } from 'uuid';
import {
  accountVerificationEmail,
  accountVerifiedNotification,
} from '../helpers/nodemailer.js';

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

router.post(
  '/user-verification',
  newUserVerificationValidation,
  async (req, res, next) => {
    try {
      const { email, code } = req.body;
      const filter = { email, verificationCode: code };
      const updateObj = { isVerified: true, verificationCode: '' };
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

export default router;
