const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const users   = require('../models/userRepo');
const SECRET  = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req,res) => {
  try {
    const { username,email,password,firstName,lastName,middleName } = req.body;
    const hash = await bcrypt.hash(password,10);
    const { id } = await users.create({
      username,email,password:hash,
      first_name:firstName, last_name:lastName, middle_name:middleName
    });
    res.json({ id, username, email });
  } catch { res.status(400).json({ message:'User already exists' }); }
};

exports.login = async (req,res) => {
  const { username,password } = req.body;
  const u = await users.findByUsername(username);
  if (!u)            return res.status(401).json({ message:'Invalid credentials' });
  if (u.blocked)     return res.status(403).json({ message:'User is blocked' });
  const ok = await bcrypt.compare(password,u.password);
  if (!ok)           return res.status(401).json({ message:'Invalid credentials' });

  const token = jwt.sign({ id:u.id,username:u.username,is_admin:u.is_admin },SECRET);
  res.json({ token, user:{ id:u.id,username:u.username,is_admin:u.is_admin,blocked:u.blocked } });
};
