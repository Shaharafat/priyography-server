/*
 *
 * Title: orders controller
 * Description: orders control functions
 * Author: Shah Arafat
 * Date: 15-04-2021
 *
 */

import { errorMessage, progressMessage, successMessage } from '../helpers/debugHelpers.js';
import { Order } from '../models/order.js';
import { User } from '../models/user.js';
import ErrorResponse from '../utils/errorResponse.js';

// ✔️ get all orders
export const getAllOrders = async (req, res, next) => {
  progressMessage('Getting all ordres.');

  try {
    const orders = await Order.find()
      .populate('user', 'firstName email -_id')
      .populate('service', 'name price -_id')
      .sort('-createdAt');

    successMessage('Fetched all orders.');
    res.status(200).json({ success: true, orders });
  } catch (error) {
    errorMessage('Couldn"t fetch orders');
    next(new ErrorResponse(500, 'Couldn"t fetch orders'));
  }
};

// ✔️ get orders of specific user
export const getUsersOrders = async (req, res, next) => {
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
};

// ✔️ place an order
export const placeOrder = async (req, res, next) => {
  progressMessage('Request to place an order');

  const { eventDate, cardNo, service, user } = req.body;
  try {
    let order = new Order({
      eventDate,
      cardNo,
      service,
      user
    });
    order = await order.save(); // place order

    successMessage('Order placed successfully');
    res.status(200).json({ success: true, message: 'Placed order successfully', order });
  } catch (error) {
    errorMessage('Order place failed.');
    next(error);
  }
};

// ✔️ change order status
export const changeStatus = async (req, res, next) => {
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
};

// ✔️ search by date
export const getOrderByDate = async (req, res, next) => {
  progressMessage('searching an order by date');
  const { date } = req.body;

  try {
    const order = await Order.find({ eventDate: date });
    if (order.length) {
      errorMessage('We have an event that day');
      return next(new ErrorResponse(400, 'We have an event that day.'));
    }

    successMessage('You can book that day.');
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
