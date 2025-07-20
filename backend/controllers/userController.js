const users = require('../models/userModel');

exports.getProfile = async (req,res) => {
  const u = await users.find(parseInt(req.params.id));
  if (!u) return res.sendStatus(404);

  const me   = req.user;
  const own  = me && me.id === u.id;
  const adm  = me && me.is_admin;

  if (!u.public_profile && !own && !adm) return res.sendStatus(404);
  if (!u.public_profile && !own && !adm) delete u.email;
  res.json(u);
};

exports.updateProfile = async (req,res) => {
  if (req.user.id !== parseInt(req.params.id)) return res.sendStatus(403);
  await users.updateProfile(req.user.id, req.body);
  res.json({ message:'Profile updated' });
};

exports.deleteProfile = async (req,res) => {
  if (req.user.id !== parseInt(req.params.id)) return res.sendStatus(403);
  await users.delete(req.user.id);
  res.json({ message:'Account deleted' });
};

exports.getSettings = async (req,res) => {
  const s = await users.settings(parseInt(req.params.id));
  if (!s) return res.status(404).json({ message:'Not found' });
  res.json(s);
};

exports.updateSettings = async (req,res) => {
  if (req.user.id !== parseInt(req.params.id)) return res.sendStatus(403);
  const { theme_preference, acknowledged, public_profile } = req.body;
  await users.updateSettings(req.user.id,{
    theme_preference, acknowledged, ip_address:req.ip, public_profile:!!public_profile
  });
  res.json({ message:'Settings updated' });
};
