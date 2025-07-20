const prisma = require('../config/prismaClient');

/* ------------------------------------------------------------- *
 * Helper – build a Prisma “where” object from query parameters  *
 * ------------------------------------------------------------- */
function buildFilter(params = {}) {
  const where = { approved: true };

  // text search (title OR content, case‑insensitive)
  if (params.search) {
    where.OR = [
      { title:   { contains: params.search, mode: 'insensitive' } },
      { content: { contains: params.search, mode: 'insensitive' } }
    ];
  }

  // category name
  if (params.category) {
    where.category = { name: params.category };
  }

  // date range  (created_at BETWEEN from / to)
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

  // show only immediately visible posts:
  //   – posts without a schedule OR with scheduled_at <= now()
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

/* ------------------------------------------------------------- *
 * Public API                                                    *
 * ------------------------------------------------------------- */
module.exports = {
  /* ---- queries ------------------------------------------------ */

  /** Get a paginated, sorted list of posts */
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
        createdBy: {
          select: { id: true, username: true }
        }
      }
    });
  },

  /** Total number of posts matching list()’s filters */
  count: params => prisma.post.count({ where: buildFilter(params) }),

  /** Find a single post by id */
  find:  id => prisma.post.findUnique({
    where:   { id },
    include: {
      category:  true,
      createdBy: { select: { id: true, username: true } }
    }
  }),

  /* ---- mutations --------------------------------------------- */
  create:  data    => prisma.post.create({ data }),
  update:  (id,d)  => prisma.post.update({ where:{ id }, data:d }),
  remove:  id      => prisma.post.delete({ where:{ id } }),

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
  pending: ()  => prisma.post.findMany({
    where:   { approved: false },
    include: { category: true, createdBy: true }
  }),

  approve: id => prisma.post.update ({ where: { id }, data: { approved: true  } }),
  reject : id => prisma.post.delete ({ where: { id } })
};