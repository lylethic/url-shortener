import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AppError from '../utils/AppError.js';
import { decodeCursor, encodeCursor } from '../utils/pagination.js';
import User from '../models/User.js';
import {
  normalizeEmail,
  isValidEmail,
  isDupKeyError,
} from '../utils/helpersValidattionUtils.js';

// =====================
const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user id', 400);
  }
};

// ======================

export const createUserAsync = async ({ user }) => {
  if (!user) throw new AppError('Please provide data', 400);
  if (!user.email) throw new AppError('Email is required', 400);
  if (!isValidEmail(user.email)) {
    throw new AppError('Invalid email format', 400);
  }
  if (!user.password) throw new AppError('Password is required', 400);
  const hashedPassword = await bcrypt.hash(user.password, 8);
  const payload = {
    ...user,
    email: normalizeEmail(user.email),
    password: hashedPassword,
  };
  try {
    const doc = await User.create(payload);
    return doc;
  } catch (err) {
    if (isDupKeyError(err)) {
      throw new AppError('Email already exists', 409);
    }
    throw err;
  }
};

export const getUserByIdAsync = async ({
  id,
  select = 'fullname roleId email isActive createdBy updateBy createdAt updatedAt',
  includeDeleted = false,
}) => {
  assertObjectId(id);
  const filter = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };
  const doc = await User.findOne(filter).select(select);
  return doc;
};

export const getEmailAsync = async ({
  email,
  select = 'fullname roleId email isActive createdBy updateBy createdAt updatedAt',
  includeDeleted,
}) => {
  if (!email) throw new AppError('Please enter your email', 400);
  if (!isValidEmail(email)) {
    throw new AppError('Invalid email format', 400);
  }
  const normalized = normalizeEmail(email);
  const filter = includeDeleted
    ? { email: normalized }
    : { email: normalized, isDeleted: false };
  const doc = await User.findOne(filter).select(select);
  return doc;
};

export const updateUserAsync = async ({
  id,
  update,
  updatedBy,
  select = 'fullname roleId email isActive isDeleted createdBy updatedBy createdAt updatedAt',
  includeDeleted = false,
}) => {
  assertObjectId(id);
  if (!update || typeof update !== 'object') {
    throw new AppError('Please provide update data', 400);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'email')) {
    if (!update.email) throw new AppError('Email connot be empty', 400);
    if (!isValidEmail(update.email)) {
      throw new AppError('Invalid email format', 400);
    }
    update.email = normalizeEmail(update.email);
  }
  if (Object.prototype.hasOwnProperty.call(update, 'password')) {
    if (!update.password) throw new AppError('Password cannot be empty', 400);
    update.password = await bcrypt.hash(update.password, 8);
  }

  if (updatedBy) update.updatedBy = updatedBy;
  const filter = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };

  try {
    var doc = await User.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    }).select(select || '');
    if (!doc) throw new AppError('User not found', 404);
    return doc;
  } catch (error) {
    if (isDupKeyError(error)) throw new AppError('Email already exists', 409);
    throw error;
  }
};

// Soft delete
export const deleteUserAsync = async ({ id, deletedBy }) => {
  assertObjectId(id);

  const doc = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false, updatedBy: deletedBy },
    { new: true }
  );

  if (!doc) throw new AppError('User not found', 404);
  return doc;
};

export const getAllUserAsync = async ({
  limit = 20,
  cursor = null,
  filter = {},
  select = 'fullname roleId email isActive isDeleted createdBy updatedBy',
}) => {
  const sort = { createdAt: -1, _id: -1 };
  const projection = `${select} createdAt`;
  const selectSet = new Set(String(select).split(/\s+/).filter(Boolean));

  const queryFilter = { ...filter };
  if (cursor) {
    const { createdAt, id } = decodeCursor(cursor);
    const objId = new mongoose.Types.ObjectId(id);

    // With sort desc, “next page” is oldest items:
    // createdAt < cursor.createdAt
    // or createdAt == cursor.createdAt and _id < cursor._id
    queryFilter.$or = [
      { createdAt: { $lt: createdAt } },
      { createdAt, _id: { $lt: objId } },
    ];
  }

  // Use one extra item to check if there's a next page
  const docs = await User.find(queryFilter)
    .sort(sort)
    .limit(limit + 1)
    .select(projection)
    .lean();

  const hasNextPage = docs.length > limit;
  const items = hasNextPage ? docs.slice(0, limit) : docs;

  const nextCursor = hasNextPage
    ? encodeCursor({
        createdAt: items[items.length - 1].createdAt,
        id: items[items.length - 1]._id,
      })
    : null;

  return {
    items: selectSet.has('createdAt')
      ? items
      : items.map(({ createdAt, ...rest }) => rest),
    page: {
      limit,
      nextCursor,
      hasNextPage,
    },
  };
};
