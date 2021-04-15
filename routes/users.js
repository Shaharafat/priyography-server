/*
 *
 * Title: users routes
 * Description: users routes
 * Author: Shah Arafat
 * Date: 07-04-2021
 *
 */
import express from 'express';
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  updateRole
} from '../controllers/users.js';
import { isAdmin } from '../middlewares/admin.js';
import { isAuthenticated } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { validateUser } from '../models/user.js';

const router = express.Router();
// create new user
router.post('/register', validate(validateUser), register);

// login user
router.post('/login', login);

// forgot password
router.post('/forgotpassword', forgotPassword);

// reset password
router.put('/resetpassword/:resetToken', resetPassword);

// update role
router.patch('/updateRole/:userId', [isAuthenticated, isAdmin], updateRole);

// export router
export default router;
