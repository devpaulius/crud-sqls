const express = require('express');
const router  = express.Router();
const postCtl = require('../controllers/postController');
const auth    = require('../middleware/authMiddleware');

// list & create
router.get('/',  postCtl.getPosts);
router.post('/', auth, postCtl.createPost);

// CRUD on single post
router.get('/:id',  async (req, res) => {
  const post = await require('../models/postRepo').find(parseInt(req.params.id));
  if (!post) return res.sendStatus(404);
  res.json(post);
});
router.put('/:id',    auth, postCtl.updatePost);
router.delete('/:id', auth, postCtl.deletePost);

// like
router.post('/:id/like', auth, postCtl.likePost);

module.exports = router;