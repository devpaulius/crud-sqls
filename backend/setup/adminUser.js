const bcrypt = require('bcrypt');
const db = require('../config/db');

function ensureAdmin() {
  db.query('SELECT * FROM users WHERE username = "admin"', (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      bcrypt.hash('admin', 10, (err, hash) => {
        if (err) throw err;
        db.query(
          'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)',
          ['admin', 'admin@example.com', hash, true],
          (err) => {
            if (err) throw err;
            console.log('Default admin created: username=admin password=admin');
          }
        );
      });
    }
  });
}

module.exports = ensureAdmin;