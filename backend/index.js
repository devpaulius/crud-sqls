const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ensureAdmin     = require('./setup/adminUser');
const authRoutes      = require('./routes/authRoutes');
const postRoutes      = require('./routes/postRoutes');
const adminRoutes     = require('./routes/adminRoutes');
const userRoutes      = require('./routes/userRoutes');
const categoryRoutes  = require('./routes/categoryRoutes');
const statsController = require('./controllers/statsController');
const db              = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

ensureAdmin();

app.use('/auth',       authRoutes);
app.use('/posts',      postRoutes);
app.use('/admin',      adminRoutes);
app.use('/users',      userRoutes);
app.use('/categories', categoryRoutes);

app.get('/stats', (req, res) => {
  db.query('SELECT COUNT(*) AS post_count FROM posts', (e1, p) => {
    if (e1) return res.status(500).end();
    db.query('SELECT COUNT(*) AS user_count FROM users', (e2, u) => {
      if (e2) return res.status(500).end();
      res.json({ post_count: p[0].post_count, user_count: u[0].user_count });
    });
  });
});

if (process.env.SHOW_LIKES_AVG === 'true') {
  app.get('/stats/likes-average', statsController.getLikesAverage);
  app.get('/posts/likes/avg',      statsController.getLikesAverage);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));