const db = require('../config/db');

const UserModel = {
  findById(id, callback) {
    db.query(
      'SELECT id, username, email, first_name, last_name, middle_name, public_profile FROM users WHERE id = ?',
      [id],
      (err, rows) => {
        if (err) return callback(err);
        callback(null, rows[0]);
      }
    );
  },

  findByUsername(username, callback) {
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  create({ username, email, password, firstName, lastName, middleName }, callback) {
    db.query(
      'INSERT INTO users (username, email, password, first_name, last_name, middle_name) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, password, firstName, lastName, middleName],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result.insertId);
      }
    );
  },

  getAll(callback) {
    db.query('SELECT id, username, email, is_admin, blocked FROM users', callback);
  },

  delete(id, callback) {
    db.query('DELETE FROM users WHERE id = ?', [id], callback);
  },

  block(id, callback) {
    db.query('UPDATE users SET blocked = 1 WHERE id = ?', [id], callback);
  },

  unblock(id, callback) {
    db.query('UPDATE users SET blocked = 0 WHERE id = ?', [id], callback);
  },

  updateSettings(userId, theme, acknowledged, ip, publicProfile, callback) {
    db.query(
      'UPDATE users SET theme_preference = ?, acknowledged = ?, ip_address = ?, public_profile = ? WHERE id = ?',
      [theme, acknowledged, ip, publicProfile, userId],
      callback
    );
  },

  getSettings(userId, callback) {
    db.query(
      'SELECT theme_preference, acknowledged, ip_address, public_profile FROM users WHERE id = ?',
      [userId],
      callback
    );
  },

  updateProfile(id, { first_name, last_name, middle_name, email }, callback) {
    db.query(
      'UPDATE users SET first_name = ?, last_name = ?, middle_name = ?, email = ? WHERE id = ?',
      [first_name, last_name, middle_name, email, id],
      callback
    );
  }
};

module.exports = UserModel;