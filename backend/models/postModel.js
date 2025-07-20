const prisma = require('../config/prismaClient');

/* ------------------------------------------------------------- *
 * Helper – build a Prisma “where” object from query parameters  *
 * ------------------------------------------------------------- */
function buildFilter(params = {}) {
  const where = { approved: true };

  if (params.search) {
    where.OR = [
      { title:   { contains: params.search, } },
      { content: { contains: params.search, } }
    ];
  }

  if (params.category) {
    where.category = { name: params.category };
  }

  if (params.from) {
    where.created_at = {
      ...(where.created_at || {}),
      gte: new Date(params.from)
    };
  }
  if (params.to) {
    where.created_at = {
      ...(where.created_at || {}),
      lte: new Date(params.to)
    };
  }

  where.AND = [
    {
      OR: [
        { scheduled_at: null },
        { scheduled_at: { lte: new Date() } }
      ]
    }
  ];

  return where;
}

module.exports = {
  /* ---- queries ------------------------------------------------ */
  list(params = {}) {
    const {
      sort   = 'created_at',
      order  = 'desc',
      limit  = 20,
      offset = 0
    } = params;

    return prisma.post.findMany({
      where:   buildFilter(params),
      orderBy: { [sort]: order },
      skip:    Number(offset),
      take:    Number(limit),
      include: {
        category:  true,
        createdBy: { select: { id: true, username: true } }
      }
    });
  },

  count: params => prisma.post.count({ where: buildFilter(params) }),

  find: id => prisma.post.findUnique({
    where: { id },
    include: {
      category: true,
      createdBy: { select: { id: true, username: true } }
    }
  }),

  /* ---- mutations --------------------------------------------- */
  create: data   => prisma.post.create({ data }),
  update: (id,d) => prisma.post.update({ where: { id }, data: d }),
  remove: id     => prisma.post.delete({ where: { id } }),

  /* ---- likes -------------------------------------------------- */
  like(userId, postId) {
    return prisma.$transaction([
      prisma.postLike.create({ data: { userId, postId } }),
      prisma.post.update({
        where: { id: postId },
        data : { likes: { increment: 1 } }
      })
    ]);
  },

  /* ---- moderation -------------------------------------------- */
  pending : () => prisma.post.findMany({ where: { approved: false }, include: { category: true, createdBy: true } }),
  approve : id => prisma.post.update({ where: { id }, data: { approved: true  } }),
  reject  : id => prisma.post.delete({ where: { id } })
};

// controllers/userController.js
const users = require('../models/userModel');

exports.getProfile = async (req, res) => {
  const u = await users.find(req.params.id);
  if (!u) return res.sendStatus(404);

  const me    = req.user;
  const owner = me && me.id === u.id;
  const admin = me && me.is_admin;

  if (!u.public_profile && !owner && !admin) return res.sendStatus(404);
  if (!u.public_profile && !owner && !admin) delete u.email;

  res.json(u);
};

exports.updateProfile = async (req, res) => {
  if (req.user.id !== Number(req.params.id)) return res.sendStatus(403);
  await users.updateProfile(req.user.id, req.body);
  res.json({ message: 'Profile updated' });
};

exports.deleteProfile = async (req, res) => {
  if (req.user.id !== Number(req.params.id)) return res.sendStatus(403);
  await users.delete(req.user.id);
  res.json({ message: 'Account deleted' });
};

exports.getSettings = async (req, res) => {
  const s = await users.settings(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
};

exports.updateSettings = async (req, res) => {
  if (req.user.id !== Number(req.params.id)) return res.sendStatus(403);

  const body = {
    ...req.body,
    acknowledged  : !!req.body.acknowledged,
    public_profile: !!req.body.public_profile,
    ip_address    : req.ip
  };

  await users.updateSettings(req.user.id, body);
  res.json({ message: 'Settings updated' });
};

// controllers/postController.js
const posts = require('../models/postModel');
const AUTO  = process.env.AUTO_APPROVE === 'true';

exports.getPosts = async (req, res) => {
  const { sort, order, search, category, from, to, limit, offset } = req.query;

  const rows = await posts.list({ sort, order, search, category, from, to,
                                  limit: +limit || 20, offset: +offset || 0 });

  // If caller did NOT pass limit/offset, return flat array (MyPosts expects this)
  if (!limit && !offset) return res.json(rows);

  const total = await posts.count({ search, category, from, to });
  res.json({ rows, total });
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, scheduled_at, categoryId } = req.body;

    // convert categoryId '' → null, '3' → 3
    const catId = categoryId ? Number(categoryId) : null;
    if (categoryId && Number.isNaN(catId)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const sched = scheduled_at ? new Date(scheduled_at) : null;

    const post = await posts.create({
      title,
      content,
      categoryId : catId,
      scheduled_at: sched,
      approved   : AUTO,
      createdById: req.user.id,
      updatedById: req.user.id
    });

    res.json({ id: post.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePost = async (req, res) => {
  const id = Number(req.params.id);
  const p  = await posts.find(id);
  if (!p) return res.sendStatus(404);
  if (p.createdById !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

  await posts.update(id, { ...req.body, updatedById: req.user.id });
  res.json({ message: 'Post updated' });
};

exports.deletePost = async (req, res) => {
  const id = Number(req.params.id);
  const p  = await posts.find(id);
  if (!p) return res.sendStatus(404);
  if (p.createdById !== req.user.id && !req.user.is_admin) return res.sendStatus(403);

  await posts.remove(id);
  res.json({ message: 'Post deleted' });
};

exports.likePost = async (req, res) => {
  try {
    await posts.like(req.user.id, Number(req.params.id));
    res.json({ message: 'Post liked' });
  } catch {
    res.status(400).json({ message: 'Already liked' });
  }
};

exports.getPendingPosts = (_, res) => posts.pending().then(r => res.json(r));
exports.approvePost     = (req, res) => posts.approve(Number(req.params.id)).then(() => res.json({ message: 'Approved' }));
exports.rejectPost      = (req, res) => posts.reject (Number(req.params.id)).then(() => res.json({ message: 'Rejected' }));