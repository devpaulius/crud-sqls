const db = require('../config/db');

const PostModel = {
  getApprovedPosts(
    { sort = 'created_at', order = 'desc', search = '', category, from, to, limit = 20, offset = 0 },
    cb
  ) {
    const allowedSort  = ['title', 'created_at', 'likes'];
    const allowedOrder = ['asc', 'desc'];
    if (!allowedSort.includes(sort))  sort  = 'created_at';
    if (!allowedOrder.includes(order)) order = 'desc';

    let conditions = 'posts.approved = 1 AND posts.title LIKE ?';
    const params   = [`%${search}%`];

    if (category) {
      conditions += ' AND c.name = ?';
      params.push(category);
    }
    if (from) {
      conditions += ' AND posts.created_at >= ?';
      params.push(from);
    }
    if (to) {
      conditions += ' AND posts.created_at <= ?';
      params.push(to);
    }

    const countSql = `
      SELECT COUNT(*) AS total
      FROM posts
      LEFT JOIN categories c ON posts.category_id = c.id
      WHERE ${conditions}
    `;
    db.query(countSql, params, (err, cRes) => {
      if (err) return cb(err);
      const total = cRes[0].total;

      const rowSql = `
        SELECT posts.*, u.username AS createdBy, c.name AS categoryName
        FROM posts
        LEFT JOIN users      u ON posts.created_by  = u.id
        LEFT JOIN categories c ON posts.category_id = c.id
        WHERE ${conditions}
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
      `;
      db.query(rowSql, [...params, parseInt(limit, 10), parseInt(offset, 10)], (err2, rows) => {
        if (err2) return cb(err2);
        cb(null, { rows, total });
      });
    });
  },

  create({ title, content, createdBy, categoryId, scheduledAt, approved }, cb) {
    const sql = scheduledAt
      ? 'INSERT INTO posts (title, content, created_by, updated_by, category_id, scheduled_at, approved) VALUES (?, ?, ?, ?, ?, ?, ?)'
      : 'INSERT INTO posts (title, content, created_by, updated_by, category_id, approved) VALUES (?, ?, ?, ?, ?, ?)';
    const params = scheduledAt
      ? [title, content, createdBy, createdBy, categoryId, scheduledAt, approved]
      : [title, content, createdBy, createdBy, categoryId, approved];
    db.query(sql, params, cb);
  },

  update(postId, { title, content, updatedBy, categoryId, scheduledAt }, cb) {
    db.query(
      'UPDATE posts SET title = ?, content = ?, updated_by = ?, category_id = ?, scheduled_at = ? WHERE id = ?',
      [title, content, updatedBy, categoryId, scheduledAt, postId],
      cb
    );
  },

  delete(postId, cb)           { db.query('DELETE FROM posts WHERE id = ?', [postId], cb); },
  findById(postId, cb)         { db.query('SELECT * FROM posts WHERE id = ?', [postId], (e,r)=>cb(e,r[0])); },
  incrementLikes(postId, cb)   { db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], cb); },
  alreadyLiked(uId,pId, cb)    { db.query('SELECT 1 FROM post_likes WHERE user_id = ? AND post_id = ?', [uId,pId], cb); },
  recordLike(uId,pId, cb)      { db.query('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)', [uId,pId], cb); },
  approve(postId, cb)          { db.query('UPDATE posts SET approved = 1 WHERE id = ?', [postId], cb); },
  reject(postId, cb)           { db.query('DELETE FROM posts WHERE id = ?', [postId], cb); },
  getPostCount(cb)             { db.query('SELECT COUNT(*) AS count FROM posts', cb); },
  getPending(cb) {
    db.query(`
      SELECT posts.*, u.username AS createdBy, c.name AS categoryName
      FROM posts
      LEFT JOIN users      u ON posts.created_by  = u.id
      LEFT JOIN categories c ON posts.category_id = c.id
      WHERE posts.approved = 0
      ORDER BY posts.created_at DESC
    `, cb);
  }
};

module.exports = PostModel;