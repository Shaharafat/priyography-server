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
import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { isAdmin } from '../middlewares/admin.js';
import { isAuthenticated } from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { Order, validateOrder } from '../models/order.js';
import { User } from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';

const router = express.Router();

// show all orders. only authenticated admin can see this.
router.get('/', [isAuthenticated, isAdmin], async (req, res, next) => {
  progressMessage('Getting all ordres.');

  try {
    const orders = await Order.find().sort('-createdAt');

    successMessage('Fetched all orders.');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    errorMessage('Couldn"t fetch orders');
    next(new ErrorResponse(500, 'Couldn"t fetch orders'));
  }
});

// show specific user's orders
router.get('/:userId', isAuthenticated, async (req, res, next) => {
  progressMessage('Getting orders of a user.');

  const { userId } = req.params;
  let user;
  try {
    user = await User.findOne({ _id: userId });
    if (!user) {
      errorMessage('No user found with this id.');
      return next(new ErrorResponse('No userfound with this id.'));
    }
  } catch (error) {
    errorMessage('Couldn"t collect user information');
    return next(error);
  }

  try {
    // find order and sort
    const orders = await Order.find({ user: { _id: userId } })
      .populate('user', 'firstName lastName email role')
      .populate('service', 'name price')
      .sort('-createdAt');

    successMessage('Fetched all order for this user.');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    errorMessage('Error fetching orders for this user.');
    return next(error);
  }
});

// create and order
router.post('/placeOrder', [isAuthenticated, validate(validateOrder)], async (req, res, next) => {
  progressMessage('Request to place an order');

  const { eventDate, cardNo, service, user } = req.body;
  try {
    let order = new Order({
      eventDate,
      cardNo,
      service,
      user,
    });
    order = await order.save(); // place order

    successMessage('Order placed successfully');
    res.status(200).json({ success: true, message: 'Placed order successfully', order });
  } catch (error) {
    errorMessage('Order place failed.');
    next(error);
  }
});

// change order status
router.patch('/changeStatus/:orderId', [isAuthenticated, isAdmin], async (req, res, next) => {
  progressMessage('Request to change order status');

  const { orderId } = req.params;
  const { status } = req.body;
  let order;
  try {
    order = await Order.findOne({ _id: orderId });
    // if order not found
    if (!order) {
      errorMessage('No order found with this id.');
      return next(404, 'No order found with this id.');
    }
  } catch (error) {
    return next(error);
  }

  try {
    order.status = status; // updating status
    order = await order.save();

    successMessage('Status updated');
    res.status(200).json({ success: true, message: 'Status updated', order });
  } catch (error) {
    next(error);
  }
});

// export
export default router;
