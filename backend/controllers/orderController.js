// backend/controllers/orderController.js
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import PDFDocument from 'pdfkit';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  console.log('Received order data:', req.body); // Для відладки

  const {
    items,
    shippingAddress,
    paymentMethod,
    totalAmount
  } = req.body;

  // Перевірка наявності обов'язкових полів
  if (!items || items.length === 0) {
    console.log('No items in order'); // Для відладки
    res.status(400);
    throw new Error('No order items');
  }

  if (!shippingAddress) {
    res.status(400);
    throw new Error('No shipping address provided');
  }

  try {
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending'
    });

    console.log('Order created:', order); // Для відладки

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error); // Для відладки
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching orders');
  }
});

export const getOrderById = asyncHandler(async (req, res) => {
  try {
    console.log('Getting order details for ID:', req.params.id);

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    // Перевірка прав доступу
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      console.log('Order found:', order);
      return res.json(order);
    } else {
      console.log('Access denied for user:', req.user._id);
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
  } catch (error) {
    console.error('Error in getOrderById:', error);
    return res.status(500).json({
      message: 'Error fetching order details',
      error: error.message
    });
  }
});
// export const getOrderById = asyncHandler(async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate('user', 'name email')
//     .populate('items.product');

//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .populate('items.product')
    .sort('-createdAt');
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;

    if (req.body.status === 'delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

export const generateInvoice = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate('user')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Створюємо PDF документ
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Встановлюємо заголовки
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);

    // Pipe PDF прямо в response
    doc.pipe(res);

    // Додаємо логотип (якщо є)
    // doc.image('path/to/logo.png', 50, 45, { width: 50 });

    // Додаємо заголовок
    doc
      .font('Helvetica-Bold')
      .fontSize(25)
      .text('INVOICE', { align: 'center' })
      .moveDown();

    // Додаємо інформацію про компанію
    doc
      .font('Helvetica')
      .fontSize(12)
      .text('Power Tools Store', { align: 'right' })
      .text('123 Main Street', { align: 'right' })
      .text('New York, NY 10001', { align: 'right' })
      .text('powertools@example.com', { align: 'right' })
      .moveDown();

    // Додаємо інформацію про замовлення
    doc
      .font('Helvetica-Bold')
      .text('BILL TO:')
      .font('Helvetica')
      .text(`${order.user.firstName} ${order.user.lastName}`)
      .text(`Email: ${order.user.email}`)
      .text(`Phone: ${order.user.phone || 'N/A'}`)
      .moveDown()
      .font('Helvetica-Bold')
      .text('ORDER DETAILS:')
      .font('Helvetica')
      .text(`Order ID: #${orderId.slice(-8)}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`)
      .text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)
      .moveDown();

    // Створюємо таблицю товарів
    const tableTop = 300;
    const itemCodeX = 50;
    const descriptionX = 150;
    const quantityX = 350;
    const priceX = 400;
    const totalX = 480;

    // Заголовки таблиці
    doc
      .font('Helvetica-Bold')
      .text('Item', itemCodeX, tableTop)
      .text('Description', descriptionX, tableTop)
      .text('Qty', quantityX, tableTop)
      .text('Price', priceX, tableTop)
      .text('Total', totalX, tableTop);

      doc.registerFont('Helvetica', 'path/to/Helvetica.ttf');
doc.registerFont('Helvetica-Bold', 'path/to/Helvetica-Bold.ttf');

    // Лінія під заголовками
    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Додаємо товари
    let position = tableTop + 30;
    order.items.forEach((item) => {
      doc
        .font('Helvetica')
        .text(item.product._id.toString().slice(-6), itemCodeX, position)
        .text(item.product.name, descriptionX, position)
        .text(item.quantity.toString(), quantityX, position)
        .text(`$${item.price.toFixed(2)}`, priceX, position)
        .text(`$${(item.quantity * item.price).toFixed(2)}`, totalX, position);

      position += 20;
    });

    // Лінія після товарів
    doc
      .moveTo(50, position + 10)
      .lineTo(550, position + 10)
      .stroke();

    // Додаємо підсумок
    doc
      .font('Helvetica-Bold')
      .text('Subtotal:', 400, position + 30)
      .text(`$${order.totalAmount.toFixed(2)}`, totalX, position + 30)
      .text('Shipping:', 400, position + 50)
      .text('$0.00', totalX, position + 50)
      .text('Total:', 400, position + 70)
      .text(`$${order.totalAmount.toFixed(2)}`, totalX, position + 70);

    // Додаємо нижній колонтитул
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(
        'Thank you for your business!',
        50,
        700,
        { align: 'center', width: 500 }
      );

    // Завершуємо документ
    doc.end();

  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Failed to generate invoice' });
  }
});

// Експортуємо всі функції
// export {
//   createOrder,
//   getOrders,
//   getOrderById,
//   updateOrderStatus,
//   getMyOrders,
//   deleteOrder
// };