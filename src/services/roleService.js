import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';
import { decodeCursor, encodeCursor } from '../utils/pagination.js';
import Role from '../models/Role.js';

const assertObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid role id', 400);
  }
};

const normalizeName = (name) => (typeof name === 'string' ? name.trim() : name);

export const createRoleAsync = async ({ role }) => {
  if (!role) throw new AppError('Please provide data', 400);
  if (!role.name) throw new AppError('Role name is required', 400);

  const payload = {
    ...role,
    name: normalizeName(role.name),
  };

  const doc = await Role.create(payload);
  return doc;
};

export const getRoleByIdAsync = async ({
  id,
  select = 'name description isActive isDeleted createdBy updatedBy createdAt updatedAt',
  includeDeleted = false,
}) => {
  assertObjectId(id);
  const filter = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };
  const doc = await Role.findOne(filter).select(select);
  return doc;
};

export const updateRoleAsync = async ({
  id,
  update,
  updatedBy,
  select = 'name description isActive isDeleted createdBy updatedBy createdAt updatedAt',
  includeDeleted = false,
}) => {
  assertObjectId(id);
  if (!update || typeof update !== 'object') {
    throw new AppError('Please provide update data', 400);
  }

  if (Object.prototype.hasOwnProperty.call(update, 'name')) {
    if (!update.name) throw new AppError('Role name cannot be empty', 400);
    update.name = normalizeName(update.name);
  }

  if (updatedBy) update.updatedBy = updatedBy;
  const filter = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };

  const doc = await Role.findOneAndUpdate(filter, update, {
    new: true,
    runValidators: true,
  }).select(select || '');

  if (!doc) throw new AppError('Role not found', 404);
  return doc;
};

// Soft delete
export const deleteRoleAsync = async ({ id, deletedBy }) => {
  assertObjectId(id);
  const doc = await Role.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, isActive: false, updatedBy: deletedBy },
    { new: true }
  );
  if (!doc) throw new AppError('Role not found', 404);
  return doc;
};

export const getAllRoleAsync = async ({
  limit = 20,
  cursor = null,
  filter = {},
  select = 'name description isActive isDeleted createdBy updatedBy',
}) => {
  const sort = { createdAt: -1, _id: -1 };
  const projection = `${select} createdAt`;
  const selectSet = new Set(String(select).split(/\s+/).filter(Boolean));

  const queryFilter = { ...filter };
  if (cursor) {
    const { createdAt, id } = decodeCursor(cursor);
    const objId = new mongoose.Types.ObjectId(id);
    queryFilter.$or = [
      { createdAt: { $lt: createdAt } },
      { createdAt, _id: { $lt: objId } },
    ];
  }

  const docs = await Role.find(queryFilter)
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
