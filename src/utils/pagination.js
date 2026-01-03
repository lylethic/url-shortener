import AppError from './AppError.js';

/**
 * Encode cursor from last item (createdAt + _id) => base64 token
 */
export const encodeCursor = ({ createdAt, id }) => {
  const payload = JSON.stringify({
    createdAt: new Date(createdAt).toISOString(),
    id: String(id),
  });
  return Buffer.from(payload, 'utf8').toString('base64url');
};

/**
 * Decode cursor token => { createdAt: Date, id: string }
 */
export const decodeCursor = (cursor) => {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf8');
    const parsed = JSON.parse(json);
    const createdAt = new Date(parsed.createdAt);
    if (Number.isNaN(createdAt.getTime()) || !parsed.id) {
      throw new AppError('Invalid cursor payload');
    }
    return { createdAt, id: String(parsed.id) };
  } catch (error) {
    throw new AppError('Validation error', 400, [
      { field: 'cursor', message: 'Invaliad cursor' },
    ]);
  }
};

/**
 * Parse cursor-based pagination params from request query
 * Reusable across endpoints
 */
export const parseCursorPagination = (
  query,
  { defaultLimit = 20, maxLimit = 100 } = {}
) => {
  const rawLimit = query.limit ?? query.pageSize;
  const limitNum = rawLimit != null ? parseInt(rawLimit, 10) : defaultLimit;

  const limit =
    Number.isFinite(limitNum) && limitNum > 0
      ? Math.min(limitNum, maxLimit)
      : defaultLimit;

  const cursor = query.cursor ? String(query.cursor) : null;
  return { limit, cursor };
};
