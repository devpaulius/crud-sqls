const User = require('../models/userModel');
const Post = require('../models/postModel');

exports.getUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(users);
  });
};

exports.deleteUser = (req, res) => {
  User.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'User deleted' });
  });
};

exports.blockUser = (req, res) => {
  User.block(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'User blocked' });
  });
};

exports.unblockUser = (req, res) => {
  User.unblock(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'User unblocked' });
  });
};

exports.getPendingPosts = (req, res) => {
  Post.getPending((err, posts) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(posts);
  });
};

exports.approvePost = (req, res) => {
  Post.approve(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Post approved' });
  });
};

exports.rejectPost = (req, res) => {
  Post.reject(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Post rejected' });
  });
};

exports.getPendingPosts = (req, res) => {
  Post.getPending((err, posts) => {
    if (err) {
      console.error('Error fetching pending:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(posts);
  });
};