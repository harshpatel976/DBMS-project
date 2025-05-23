const express = require('express');
const router = express.Router();
const { isAuthenticated, isStaff } = require('../middleware/auth');
const { getInventory, addInventoryItem } = require('../controllers/inventoryController');

router.get('/', isAuthenticated, isStaff, getInventory);
router.post('/', isAuthenticated, isStaff, addInventoryItem);

module.exports = router;