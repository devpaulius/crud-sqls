const prisma = require('../config/prismaClient');

const ALLOWED_PROFILE  = ['first_name', 'last_name', 'middle_name', 'email'];
const ALLOWED_SETTINGS = ['theme_preference', 'acknowledged', 'ip_address', 'public_profile'];

const pick = (src, keys) =>
  Object.fromEntries(keys.filter(k => k in src).map(k => [k, src[k]]));

module.exports = {
  find:            id => prisma.user.findUnique({ where: { id } }),
  findByUsername:  u  => prisma.user.findUnique({ where: { username: u } }),
  create:          d  => prisma.user.create({ data: d }),
  list:            () => prisma.user.findMany({ select: { id:true,username:true,email:true,is_admin:true,blocked:true } }),
  delete:          id => prisma.user.delete({ where: { id } }),
  block:           id => prisma.user.update({ where:{ id }, data:{ blocked:true  } }),
  unblock:         id => prisma.user.update({ where:{ id }, data:{ blocked:false } }),

  updateProfile(id, data) {
    return prisma.user.update({ where: { id }, data: pick(data, ALLOWED_PROFILE) });
  },

  settings: id => prisma.user.findUnique({
    where: { id },
    select: { theme_preference:true, acknowledged:true, ip_address:true, public_profile:true }
  }),

  updateSettings(id, data) {
    return prisma.user.update({ where: { id }, data: pick(data, ALLOWED_SETTINGS) });
  }
};