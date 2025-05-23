const express = require('express');
const router = express.Router();
const { isAuthenticated, isStaff } = require('../middleware/auth');
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');

router.get('/', getMenu);
router.post('/', isAuthenticated, isStaff, addMenuItem);
router.put('/:id', isAuthenticated, isStaff, updateMenuItem);
router.delete('/:id', isAuthenticated, isStaff, deleteMenuItem);

module.exports = router;