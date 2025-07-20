const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', userController.getProfile);
router.put('/:id', authMiddleware, userController.updateProfile);
router.delete('/:id', authMiddleware, userController.deleteProfile);
router.get('/:id/settings', authMiddleware, userController.getSettings);
router.put('/:id/settings', authMiddleware, userController.updateSettings);

module.exports = router;