const express = require('express');
const router = express.Router();
const { isAuthenticated, isStaff } = require('../middleware/auth');
const { placeOrder, getOrders, getStaffOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/', isAuthenticated, placeOrder);
router.get('/', isAuthenticated, getOrders);
router.get('/staff', isAuthenticated, isStaff, getStaffOrders);
router.put('/:id', isAuthenticated, isStaff, updateOrderStatus);


module.exports = router;