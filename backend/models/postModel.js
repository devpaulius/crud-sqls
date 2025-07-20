const prisma = require('../config/prismaClient');

const toFilter = p => {
  const where = { approved: true };
  if (p.search)
    where.OR = [
      { title:   { contains:p.search, mode:'insensitive' } },
      { content: { contains:p.search, mode:'insensitive' } }
    ];
  if (p.category) where.category = { name:p.category };
  if (p.from) where.created_at = { gte:new Date(p.from), ...(where.created_at||{}) };
  if (p.to)   where.created_at = { lte:new Date(p.to  ), ...(where.created_at||{}) };
  where.OR = [ { scheduled_at: null }, { scheduled_at:{ lte:new Date() } } ];
  return where;
};

module.exports = {
  list(params){
    const { sort='created_at', order='desc', limit=20, offset=0 } = params;
    return prisma.post.findMany({
      where:   toFilter(params),
      skip:    +offset,
      take:    +limit,
      orderBy: { [sort]: order },
      include: { category:true, createdBy:true }
    });
  },
  count:   p      => prisma.post.count({ where: toFilter(p) }),
  create:  data   => prisma.post.create({ data }),
  find:    id     => prisma.post.findUnique({ where:{ id }, include:{ category:true, createdBy:true } }),
  update:  (id,d) => prisma.post.update({ where:{ id }, data:d }),
  remove:  id     => prisma.post.delete({ where:{ id } }),

  like(userId,postId){
    return prisma.$transaction([
      prisma.postLike.create({ data:{ userId, postId } }),
      prisma.post.update({ where:{ id:postId }, data:{ likes:{ increment:1 } } })
    ]);
  },

  pending: () => prisma.post.findMany({ where:{ approved:false }, include:{ category:true, createdBy:true } }),
  approve: id => prisma.post.update({ where:{ id }, data:{ approved:true } }),
  reject:  id => prisma.post.delete({ where:{ id } })
};