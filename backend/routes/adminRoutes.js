const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.delete('/users/:id', authMiddleware, adminMiddleware, adminController.deleteUser);
router.put('/users/:id/block', authMiddleware, adminMiddleware, adminController.blockUser);
router.put('/users/:id/unblock', authMiddleware, adminMiddleware, adminController.unblockUser);
router.get('/posts/pending', authMiddleware, adminMiddleware, adminController.getPendingPosts);
router.put('/posts/:id/approve', authMiddleware, adminMiddleware, adminController.approvePost);
router.delete('/posts/:id/reject', authMiddleware, adminMiddleware, adminController.rejectPost);

module.exports = router;