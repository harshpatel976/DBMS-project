const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password, role, name, email, phone } = req.body;
  try {
    const user = new User({ username, password, role, name, email, phone });
    await user.save();
    req.session.user = { id: user._id, username, role };
    res.status(201).json({ message: 'User registered', user: req.session.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    req.session.user = { id: user._id, username, role: user.role };
    res.json({ message: 'Logged in', user: req.session.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
};