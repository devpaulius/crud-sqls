const prisma = require('../config/prismaClient');

/**
 *  GET /stats
 *  Returns a few aggregate counters for the dashboard.
 */
exports.getSummary = async (_, res) => {
  try {
    const [postCount, userCount, likeCount] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.postLike.count()
    ]);
    res.json({ postCount, userCount, likeCount });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

/**
 *  GET /stats/likes-average  (alias /posts/likes/avg)
 *  Average number of likes per post – handy for a chart.
 */
exports.getLikesAverage = async (_, res) => {
  try {
    const [likes, posts] = await Promise.all([
      prisma.postLike.count(),
      prisma.post.count()
    ]);
    res.json({ averageLikes: posts ? (likes / posts).toFixed(2) : 0 });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
