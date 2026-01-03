import Url from '../models/Url.js';
import { nanoid } from 'nanoid';
import AppError from '../utils/AppError.js';
import { decodeCursor, encodeCursor } from '../utils/pagination.js';
import mongoose from 'mongoose';

export const createShortUrlService = async ({ originalUrl }) => {
  if (!originalUrl) {
    throw new AppError('Validation error', 400, [
      { field: 'originalUrl', message: 'Original URL is required' },
    ]);
  }

  let parsed;
  try {
    parsed = new URL(originalUrl);
  } catch {
    throw new AppError('Validation error', 400, [
      { field: 'originalUrl', message: 'Invalid URL format' },
    ]);
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new AppError('Validation error', 400, [
      {
        field: 'originalUrl',
        message: 'Only http/https protocols are allowed',
      },
    ]);
  }

  const normalizedUrl = originalUrl.trim();
  for (let i = 0; i < 5; i++) {
    const shortId = nanoid(7);
    try {
      const doc = await Url.create({ shortId, originalUrl: normalizedUrl });
      return { shortId: doc.shortId, originalUrl: doc.originalUrl };
    } catch (error) {
      // MongoDB duplicate key error code
      if (error?.code === 11000) {
        continue;
      }
      throw error;
    }
  }
  throw new AppError('Could not generate unique shortId, please retry', 500);
};

export const redirectService = async ({ shortId }) => {
  const now = new Date();

  const doc = await Url.findOneAndUpdate(
    {
      shortId,
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: now } },
      ],
    },
    { $inc: { clicks: 1 } },
    { new: true, projection: { originalUrl: 1, redirectType: 1 } }
  );
  if (!doc) {
    throw new AppError('URL not found', 404);
  }

  return { originalUrl: doc.originalUrl, redirectType: doc.redirectType };
};

export const getAllService = async ({
  limit = 20,
  cursor = null,
  filter = {},
  select = 'shortId originalUrl clicks isActive expiresAt redirectType createdAt',
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
  const docs = await Url.find(queryFilter)
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
