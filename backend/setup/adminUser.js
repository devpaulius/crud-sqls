const bcrypt = require('bcrypt');
const prisma = require('../config/prismaClient');

async function ensureAdmin() {
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (admin) return;

  const hash = await bcrypt.hash('admin', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hash,
      is_admin: true
    }
  });
  console.log('Default admin created: username=admin password=admin');
}

module.exports = ensureAdmin;