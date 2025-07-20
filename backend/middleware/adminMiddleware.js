const db = require('../config/db');

function adminMiddleware(req, res, next) {
  const userId = req.user.id;
  db.query('SELECT is_admin FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.sendStatus(500);
    if (results.length > 0 && results[0].is_admin) return next();
    res.sendStatus(403);
  });
}

module.exports = adminMiddleware;