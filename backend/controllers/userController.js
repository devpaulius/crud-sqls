// controllers/userController.js
const users = require('../models/userModel');

exports.getProfile = async (req,res)=>{
  const u = await users.find(req.params.id);
  if(!u) return res.sendStatus(404);

  const me      = req.user;                // gali būti undefined
  const owner   = me && me.id === u.id;
  const admin   = me && me.is_admin;

  if(!u.public_profile && !owner && !admin) return res.sendStatus(404);
  if(!u.public_profile && !owner && !admin) delete u.email;

  res.json(u);
};

exports.updateProfile = async (req,res)=>{
  if(req.user.id !== Number(req.params.id)) return res.sendStatus(403);
  await users.updateProfile(req.user.id, req.body);
  res.json({ message:'Profile updated' });
};

exports.deleteProfile = async (req,res)=>{
  if(req.user.id !== Number(req.params.id)) return res.sendStatus(403);
  await users.delete(req.user.id);
  res.json({ message:'Account deleted' });
};

exports.getSettings = async (req,res)=>{
  const s = await users.settings(req.params.id);
  if(!s) return res.status(404).json({ message:'Not found' });
  res.json(s);
};

exports.updateSettings = async (req,res)=>{
  if(req.user.id !== Number(req.params.id)) return res.sendStatus(403);

  const body = {
    ...req.body,
    acknowledged  : !!req.body.acknowledged,
    public_profile: !!req.body.public_profile,
    ip_address    : req.ip,
  };

  await users.updateSettings(req.user.id, body);
  res.json({ message:'Settings updated' });
};