const express = require('express');
const db = require('../config/db');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const formatOrderItem = (item) => ({
  _id: item.id,
  product: item.product_id,
  name: item.name,
  qty: item.qty,
  image: item.image,
  price: Number(item.price),
});

const formatOrder = (order, items = []) => ({
  _id: order.id,

  user: order.user
    ? order.user
    : order.user_id,

  orderItems: items.map(formatOrderItem),

  paymentMethod: order.payment_method,

  itemsPrice: Number(order.items_price),
  shippingPrice: Number(order.shipping_price),
  totalPrice: Number(order.total_price),

  shippingAddress: {
    address: order.shipping_address,
    city: order.shipping_city,
    postalCode: order.shipping_postal_code,
    country: order.shipping_country,
  },

  isPaid: Boolean(order.is_paid),
  paidAt: order.paid_at,

  isDelivered: Boolean(order.is_delivered),
  deliveredAt: order.delivered_at,

  createdAt: order.created_at,
  updatedAt: order.updated_at,
});


router.post('/', protect, async (req, res) => {
  let connection;

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: 'No order items',
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
      (
        user_id,
        payment_method,
        items_price,
        shipping_price,
        total_price,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_country
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user._id,
        paymentMethod || 'Cash on Delivery',
        itemsPrice,
        shippingPrice,
        totalPrice,
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.postalCode,
        shippingAddress.country,
      ]
    );

    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.query(
        `INSERT INTO order_items
        (
          order_id,
          product_id,
          name,
          qty,
          image,
          price
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product,
          item.name,
          item.qty,
          item.image,
          item.price,
        ]
      );
    }

    await connection.commit();

    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    const order = formatOrder(orders[0], items);

    res.status(201).json(order);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});


router.get('/myorders', protect, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT * FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user._id]
    );

    for (const order of orders) {
      const [items] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );

      order.user = req.user;

      Object.assign(order, formatOrder(order, items));
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


router.get('/:id', protect, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT
        orders.*,
        users.name AS user_name,
        users.email AS user_email
       FROM orders
       JOIN users ON orders.user_id = users.id
       WHERE orders.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    const orderData = orders[0];

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    orderData.user = {
      _id: orderData.user_id,
      name: orderData.user_name,
      email: orderData.user_email,
    };

    const order = formatOrder(orderData, items);

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT
        orders.*,
        users.name AS user_name,
        users.email AS user_email
       FROM orders
       JOIN users ON orders.user_id = users.id
       ORDER BY orders.created_at DESC`
    );

    const formattedOrders = [];

    for (const order of orders) {
      const [items] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );

      order.user = {
        _id: order.user_id,
        name: order.user_name,
        email: order.user_email,
      };

      formattedOrders.push(formatOrder(order, items));
    }

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    await db.query(
      `UPDATE orders
       SET is_delivered = ?, delivered_at = ?
       WHERE id = ?`,
      [true, new Date(), req.params.id]
    );

    const [updatedOrders] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [req.params.id]
    );

    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    updatedOrders[0].user = req.user;

    const updatedOrder = formatOrder(updatedOrders[0], items);

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;