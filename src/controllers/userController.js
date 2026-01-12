import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/response.js';
import { parseCursorPagination } from '../utils/pagination.js';
import {
  createUserAsync,
  getUserByIdAsync,
  getAllUserAsync,
  getEmailAsync,
  updateUserAsync,
  deleteUserAsync,
} from '../services/userService.js';

export const createUser = catchAsync(async (req, res) => {
  const doc = await createUserAsync({ user: req.body });
  return sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'User created',
    data: doc,
  });
});

export const getUserById = catchAsync(async (req, res) => {
  const includeDeleted = String(req.query.includeDeleted) === 'true';
  const select = req.query.select
    ? String(req.query.select).split(',').join(' ')
    : undefined;

  const doc = await getUserByIdAsync({
    id: req.params.id,
    select,
    includeDeleted,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Fetched user',
    data: doc,
  });
});

export const getUserByEmail = catchAsync(async (req, res) => {
  const includeDeleted = String(req.query.includeDeleted) === 'true';
  const select = req.query.select
    ? String(req.query.select).split(',').join(' ')
    : undefined;

  const doc = await getEmailAsync({
    email: req.query.email,
    select,
    includeDeleted,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Fetched user',
    data: doc,
  });
});

export const getAllUser = catchAsync(async (req, res) => {
  const { limit, cursor } = parseCursorPagination(req.query);
  const includeDeleted = String(req.query.includeDeleted) === 'true';

  const allowed = new Set([
    'fullname',
    'roleId',
    'email',
    'isActive',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'createdAt',
    'updatedAt',
  ]);

  const fields = String(req.query.fields || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((f) => allowed.has(f));

  const select =
    fields.length > 0
      ? fields.join(' ')
      : 'fullname roleId email isActive isDeleted createdBy updatedBy';

  const filter = includeDeleted ? {} : { isDeleted: false };

  const result = await getAllUserAsync({
    limit,
    cursor,
    filter,
    select,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Fetched users',
    data: result,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const includeDeleted = String(req.query.includeDeleted) === 'true';
  const doc = await updateUserAsync({
    id: req.params.id,
    update: req.body,
    updatedBy: req.body.updatedBy,
    includeDeleted,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User updated',
    data: doc,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const doc = await deleteUserAsync({
    id: req.params.id,
    deletedBy: req.body.deletedBy,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User deleted',
    data: doc,
  });
});
