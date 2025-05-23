const Inventory = require('../models/Invertory');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addInventoryItem = async (req, res) => {
  const { itemName, quantity, unit } = req.body;
  try {
    const inventoryItem = new Inventory({ itemName, quantity, unit });
    await inventoryItem.save();
    res.status(201).json(inventoryItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};