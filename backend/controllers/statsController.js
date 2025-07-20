const db = require('../config/db');

exports.getLikesAverage = (req, res) => {
  const sql = `
    SELECT 
      IFNULL(AVG(likes), 0) AS avg_likes
    FROM posts
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ avg_likes: results[0].avg_likes });
  });
};