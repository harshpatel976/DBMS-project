const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Inventory', inventorySchema);