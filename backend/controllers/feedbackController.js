const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

exports.submitFeedback = async (req, res) => {
  const { orderId, rating, comment } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.session.user.id) {
      return res.status(400).json({ error: 'Invalid order' });
    }
    const feedback = new Feedback({
      userId: req.session.user.id,
      orderId,
      rating,
      comment,
    });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('userId').populate('orderId');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};