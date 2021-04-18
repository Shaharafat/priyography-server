/*
 *
 * Title: order routes
 * Description: order routes to create, update
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */
// dependencies
import express from 'express';
import {
  changeStatus,
  getAllOrders,
  getOrderByDate,
  getUsersOrders,
  placeOrder
} from '../controllers/orders.js';
import { isAdmin } from '../middlewares/admin.js';
import { isAuthenticated } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { validateOrder } from '../models/order.js';

const router = express.Router();

// show all orders. only authenticated admin can see this.
router.get('/', [isAuthenticated, isAdmin], getAllOrders);

// show specific user's orders
router.get('/:userId', isAuthenticated, getUsersOrders);

// search order by event date
router.post('/date', getOrderByDate);

// create and order
router.post('/placeOrder', [isAuthenticated, validate(validateOrder)], placeOrder);

// change order status
router.patch('/changeStatus/:orderId', [isAuthenticated, isAdmin], changeStatus);

// export
export default router;
