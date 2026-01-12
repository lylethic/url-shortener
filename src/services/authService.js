import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import {
  normalizeEmail,
  isValidEmail,
  isDupKeyError,
} from '../utils/helpersValidattionUtils.js';
import Role from '../models/Role.js';

const JWT_SECRET = process.env.SECRETKEY || 'change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const signToken = (user) =>
  jwt.sign(
    { sub: user._id, roleId: user.roleId, email: user.email },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );

export const register = async ({ fullname, email, password }) => {
  if (!fullname || !email || !password) {
    throw new AppError('Please provide fullname, email, password', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at leaset 8 characters long', 400, [
      { field: 'password', message: 'Password too short' },
    ]);
  }

  const role = await Role.findOne({ name: /^user$/i }).select('_id');
  if (!role) throw new AppError('Default role not found', 500);
  const roleId = String(role._id);

  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    throw new AppError('Invalid email format', 400, [
      { field: 'email', message: 'Invalid email format' },
    ]);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const doc = await User.create({
      fullname,
      roleId,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = signToken(doc);
    return {
      token,
      user: {
        id: doc._id,
        fullname: doc.fullname,
        email: doc.email,
      },
    };
  } catch (err) {
    if (isDupKeyError(err)) {
      throw new AppError('Email already exists', 409);
    }
    throw err;
  }
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    throw new AppError('Invalid email format', 400);
  }
  const user = await User.findOne({
    email: normalizedEmail,
    isDeleted: false,
  }).select('+password');

  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.isActive) throw new AppError('User is inactive', 403);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  const token = signToken(user);
  return {
    token,
    user: {
      id: user._id,
      fullname: user.fullname,
      roleId: user.roleId,
      email: user.email,
    },
  };
};
