const posts = require('../models/postRepo');
const AUTO  = process.env.AUTO_APPROVE === 'true';

exports.getPosts = async (req, res) => {
  const { sort, order, search, category, from, to, limit, offset } = req.query;
  const rows  = await posts.list({ sort, order, search, category, from, to,
                                   limit: +limit || 20, offset: +offset || 0 });
  const total = await posts.count({ search, category, from, to });
  res.json({ rows, total });
};

exports.createPost = async (req, res) => {
  const { title, content, scheduled_at, categoryId } = req.body;
  const sched = scheduled_at ? new Date(scheduled_at) : null;

  const p = await posts.create({
    title,
    content,
    categoryId: categoryId || null,
    scheduled_at: sched,
    approved: AUTO,
    createdById: req.user.id,
    updatedById: req.user.id
  });
  res.json({ id: p.id });
};

exports.updatePost = async (req, res) => {
  const id = parseInt(req.params.id);
  const p  = await posts.find(id);
  if (!p) return res.sendStatus(404);
  if (p.createdById !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

  await posts.update(id, { ...req.body, updatedById: req.user.id });
  res.json({ message: 'Post updated' });
};

exports.deletePost = async (req, res) => {
  const id = parseInt(req.params.id);
  const p  = await posts.find(id);
  if (!p) return res.sendStatus(404);
  if (p.createdById !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

  await posts.remove(id);
  res.json({ message: 'Post deleted' });
};

exports.likePost = async (req, res) => {
  try {
    await posts.like(req.user.id, parseInt(req.params.id));
    res.json({ message: 'Post liked' });
  } catch {
    res.status(400).json({ message: 'Already liked' });
  }
};

exports.getPendingPosts = (_, res) => posts.pending().then(r => res.json(r));
exports.approvePost     = (req, res) => posts.approve(parseInt(req.params.id)).then(() => res.json({ message: 'Approved' }));
exports.rejectPost      = (req, res) => posts.reject (parseInt(req.params.id)).then(() => res.json({ message: 'Rejected' }));