const Category = require('../models/categoryModel');

exports.getAll = (req, res) => {
  Category.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

exports.create = (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required' });
  }
  Category.create(name.trim(), (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ id: result.insertId, name: name.trim() });
  });
};

exports.update = (req, res) => {
  const { name } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Category name is required' });
  }
  Category.update(req.params.id, name.trim(), (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Category updated' });
  });
};

exports.delete = (req, res) => {
  Category.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Category deleted' });
  });
};