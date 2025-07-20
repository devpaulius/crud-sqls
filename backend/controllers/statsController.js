const prisma = require('../config/prismaClient');

exports.getLikesAverage = async (_,res) => {
  const { _avg } = await prisma.post.aggregate({ _avg:{ likes:true } });
  res.json({ avg_likes: _avg.likes || 0 });
};
