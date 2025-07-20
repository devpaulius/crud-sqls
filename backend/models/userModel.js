const prisma = require('../config/prismaClient');

const PROFILE_FIELDS  = ['first_name', 'last_name', 'middle_name', 'email'];
const SETTINGS_FIELDS = ['theme_preference', 'acknowledged', 'ip_address', 'public_profile'];

const pick = (src, keys) =>
  Object.fromEntries(keys.filter(k => k in src).map(k => [k, src[k]]));

module.exports = {
  /** ---------------------------------------------- */
  /** CRUD                                           */
  /** ---------------------------------------------- */
  create: data => prisma.user.create({ data }),

  find: id => prisma.user.findUnique({
    where:  { id: Number(id) },
    select: {
      id: true,
      username: true,
      email: true,
      first_name: true,
      last_name: true,
      middle_name: true,
      public_profile: true,
      blocked: true,
      is_admin: true
    }
  }),

  findByUsername: username => prisma.user.findUnique({ where: { username } }),

  list: () => prisma.user.findMany({
    select: { id: true, username: true, email: true, is_admin: true, blocked: true }
  }),

  delete: id => prisma.user.delete({ where: { id: Number(id) } }),

  /** ---------------------------------------------- */
  /** Admin helpers                                  */
  /** ---------------------------------------------- */
  block:   id => prisma.user.update({ where: { id: Number(id) }, data: { blocked: true  } }),
  unblock: id => prisma.user.update({ where: { id: Number(id) }, data: { blocked: false } }),

  /** ---------------------------------------------- */
  /** Profile & settings                             */
  /** ---------------------------------------------- */
  updateProfile: (id, data) => prisma.user.update({
    where: { id: Number(id) },
    data : pick(data, PROFILE_FIELDS)
  }),

  settings: id => prisma.user.findUnique({
    where:  { id: Number(id) },
    select: {
      theme_preference: true,
      acknowledged: true,
      ip_address: true,
      public_profile: true
    }
  }),

  updateSettings: (id, data) => prisma.user.update({
    where: { id: Number(id) },
    data : pick(data, SETTINGS_FIELDS)
  })
};