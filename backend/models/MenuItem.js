const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  available: { type: Boolean, default: true },
  inventoryItems: [
    {
      inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
      quantityUsed: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);