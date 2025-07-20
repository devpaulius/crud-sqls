const users = require('../models/userModel');
const posts = require('../models/postModel');

exports.getUsers        = (_,res) => users.list().then(r=>res.json(r));
exports.deleteUser      = (req,res) => users.delete(parseInt(req.params.id)).then(()=>res.json({ message:'User deleted' }));
exports.blockUser       = (req,res) => users.block (parseInt(req.params.id)).then(()=>res.json({ message:'User blocked' }));
exports.unblockUser     = (req,res) => users.unblock(parseInt(req.params.id)).then(()=>res.json({ message:'User unblocked' }));
exports.getPendingPosts = (_,res) => posts.pending().then(r=>res.json(r));
exports.approvePost     = (req,res) => posts.approve(parseInt(req.params.id)).then(()=>res.json({ message:'Post approved' }));
exports.rejectPost      = (req,res) => posts.reject (parseInt(req.params.id)).then(()=>res.json({ message:'Post rejected' }));
