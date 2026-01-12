import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/response.js';
import { parseCursorPagination } from '../utils/pagination.js';
import {
  createRoleAsync,
  getRoleByIdAsync,
  getAllRoleAsync,
  updateRoleAsync,
  deleteRoleAsync,
} from '../services/roleService.js';

export const createRole = catchAsync(async (req, res) => {
  const doc = await createRoleAsync({ role: req.body });
  return sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Role created',
    data: doc,
  });
});

export const getRoleById = catchAsync(async (req, res) => {
  const includeDeleted = String(req.query.includeDeleted) === 'true';
  const select = req.query.select
    ? String(req.query.select).split(',').join(' ')
    : undefined;

  const doc = await getRoleByIdAsync({
    id: req.params.id,
    select,
    includeDeleted,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Fetched role',
    data: doc,
  });
});

export const getAllRole = catchAsync(async (req, res) => {
  const { limit, cursor } = parseCursorPagination(req.query);
  const includeDeleted = String(req.query.includeDeleted) === 'true';

  const allowed = new Set([
    'name',
    'description',
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
      : 'name description isActive isDeleted createdBy updatedBy';

  const filter = includeDeleted ? {} : { isDeleted: false };

  const result = await getAllRoleAsync({
    limit,
    cursor,
    filter,
    select,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Fetched roles',
    data: result,
  });
});

export const updateRole = catchAsync(async (req, res) => {
  const includeDeleted = String(req.query.includeDeleted) === 'true';
  const doc = await updateRoleAsync({
    id: req.params.id,
    update: req.body,
    updatedBy: req.body.updatedBy,
    includeDeleted,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Role updated',
    data: doc,
  });
});

export const deleteRole = catchAsync(async (req, res) => {
  const doc = await deleteRoleAsync({
    id: req.params.id,
    deletedBy: req.body.deletedBy,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Role deleted',
    data: doc,
  });
});
