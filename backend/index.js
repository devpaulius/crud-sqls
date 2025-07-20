const express  = require('express');
const cors     = require('cors');
require('dotenv').config();

const ensureAdmin = require('./setup/adminUser');
const authRoutes  = require('./routes/authRoutes');
const postRoutes  = require('./routes/postRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes  = require('./routes/userRoutes');
const catRoutes   = require('./routes/categoryRoutes');
const statsCtrl   = require('./controllers/statsController');

const prisma = require('./config/prismaClient');

const app = express();
app.use(cors());
app.use(express.json());

ensureAdmin();        // creates default admin if none

app.use('/auth',       authRoutes);
app.use('/posts',      postRoutes);
app.use('/admin',      adminRoutes);
app.use('/users',      userRoutes);
app.use('/categories', catRoutes);

app.get('/stats/likes-average', statsCtrl.getLikesAverage);
app.get('/posts/likes/avg',      statsCtrl.getLikesAverage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API on :${PORT}`));

// graceful shutdown
process.on('SIGTERM', () => prisma.$disconnect());
process.on('SIGINT',  () => prisma.$disconnect());
