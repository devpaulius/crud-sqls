const prisma = require('../config/prismaClient');

async function adminMiddleware(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: req.user.id },
      select: { is_admin: true }
    });
    if (user?.is_admin) return next();
    res.sendStatus(403);
  } catch (e) {
    console.error('adminMiddleware', e);
    res.sendStatus(500);
  }
}

module.exports = adminMiddleware;