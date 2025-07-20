const db = require('../config/db');

const CategoryModel = {
  getAll(callback) {
    db.query('SELECT * FROM categories', callback);
  },

  create(name, callback) {
    db.query('INSERT INTO categories (name) VALUES (?)', [name], callback);
  },

  update(id, name, callback) {
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], callback);
  },

  delete(id, callback) {
    db.query('DELETE FROM categories WHERE id = ?', [id], callback);
  }
};

module.exports = CategoryModel;