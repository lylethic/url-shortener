import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';
import Role from '../models/Role.js';

const JWT_SECRET = process.env.SECRETKEY || 'change_me';

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      roleId: payload.roleId,
    };
    return next();
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }
};

export const requireRole = (allowedRoles = []) => {
  const allowed = new Set(
    Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  );

  return (req, res, next) => {
    if (!req.user?.roleId || !allowed.has(req.user.roleId)) {
      return next(new AppError('Forbidden', 403));
    }
    return next();
  };
};

const normalizeRoleName = (name) =>
  typeof name === 'string' ? name.trim().toLowerCase() : '';

export const requireRoleName = (allowedNames = []) => {
  const allowed = new Set(
    (Array.isArray(allowedNames) ? allowedNames : [allowedNames]).map(
      normalizeRoleName
    )
  );

  return async (req, res, next) => {
    if (!req.user?.roleId) {
      return next(new AppError('Forbidden', 403));
    }

    const { roleId } = req.user;
    let roleName = '';

    if (mongoose.Types.ObjectId.isValid(roleId)) {
      const role = await Role.findOne({
        _id: roleId,
        isDeleted: false,
        isActive: true,
      }).select('name');
      if (!role) return next(new AppError('Forbidden', 403));
      roleName = role.name;
    } else {
      roleName = roleId;
    }

    if (!allowed.has(normalizeRoleName(roleName))) {
      return next(new AppError('Forbidden', 403));
    }

    return next();
  };
};

export const requireUserOrAdmin = requireRoleName(['user', 'admin']);
