const prisma = require('../config/prismaClient');

module.exports = {
  all:     ()        => prisma.category.findMany(),
  create:  name      => prisma.category.create({ data:{ name } }),
  update:  (id,name) => prisma.category.update({ where:{ id }, data:{ name } }),
  delete:  id        => prisma.category.delete({ where:{ id } })
};