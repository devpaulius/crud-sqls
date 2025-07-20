const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = (req, res) => {
  const { username, email, password, firstName, lastName, middleName } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    User.create({ username, email, password: hash, firstName, lastName, middleName }, (err, userId) => {
      if (err) return res.status(400).json({ message: 'User already exists' });
      res.json({ id: userId, username, email });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.blocked) return res.status(403).json({ message: 'User is blocked' });

    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, username: user.username, is_admin: !!user.is_admin }, JWT_SECRET);
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          is_admin: !!user.is_admin,
          blocked: !!user.blocked
        }
      });
    });
  });
};