const User = require('../models/userModel');

exports.getProfile = (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err || !user) return res.sendStatus(404);

    const requester = req.user;
    const isOwner = requester && requester.id === user.id;
    const isAdmin = requester && requester.is_admin;

    if (!user.public_profile && !isOwner && !isAdmin) return res.sendStatus(404);

    if (!user.public_profile && !isOwner && !isAdmin) delete user.email;

    res.json(user);
  });
};

exports.updateProfile = (req, res) => {
  const id = parseInt(req.params.id);
  if (id !== req.user.id) return res.sendStatus(403);

  const { first_name, last_name, middle_name, email } = req.body;
  User.updateProfile(id, { first_name, last_name, middle_name, email }, err => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Profile updated' });
  });
};

exports.deleteProfile = (req, res) => {
  const id = parseInt(req.params.id);
  if (id !== req.user.id) return res.sendStatus(403);

  User.delete(id, err => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Account deleted' });
  });
};

exports.getSettings = (req, res) => {
  const userId = req.params.id;
  User.getSettings(userId, (err, settings) => {
    if (err || !settings) return res.status(404).json({ message: 'Not found' });
    res.json(settings[0]);
  });
};

exports.updateSettings = (req, res) => {
  const userId = req.params.id;
  const { theme_preference, acknowledged, public_profile } = req.body;
  const ip = req.ip;

  User.updateSettings(userId, theme_preference, acknowledged, ip, !!public_profile, err => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Settings updated' });
  });
};