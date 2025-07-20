const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', postController.getPosts);
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/like', authMiddleware, postController.likePost);

// GET /posts/:id - single post fetch
router.get('/:id', (req, res) => {
  const Post = require('../models/postModel');
  Post.findById(req.params.id, (err, results) => {
    if (err || !results) return res.sendStatus(404);
    res.json(results);
  });
});

module.exports = router;