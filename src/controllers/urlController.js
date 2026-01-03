import { catchAsync } from '../utils/catchAsync.js';
import {
  createShortUrlService,
  redirectService,
  getAllService,
} from '../services/urlService.js';
import { sendResponse } from '../utils/response.js';
import { parseCursorPagination } from '../utils/pagination.js';

/* ---------------- CREATE SHORT URL ---------------- */
export const createShortUrl = catchAsync(async (req, res) => {
  const result = await createShortUrlService({
    originalUrl: req.body.originalUrl,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Short URL created',
    data: {
      ...result,
      shortUrl: `${process.env.BASE_URL}/${result.shortId}`,
    },
  });
});

/* ---------------- REDIRECT ---------------- */
export const redirectUrl = catchAsync(async (req, res) => {
  const { originalUrl, redirectType } = await redirectService({
    shortId: req.params.shortId,
  });
  res.redirect(redirectType, originalUrl);
});

export const getAllUrl = catchAsync(async (req, res) => {
  const { limit, cursor } = parseCursorPagination(req.query);

  const allowed = new Set([
    'shortId',
    'originalUrl',
    'clicks',
    'isActive',
    'expiresAt',
    'redirectType',
    'createdAt',
  ]);

  const fields = String(req.query.fields || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((f) => allowed.has(f));

  const select =
    fields.length > 0
      ? fields.join(' ')
      : 'shortId originalUrl clicks isActive expiresAt redirectType';

  const result = await getAllService({
    limit,
    cursor,
    select: select,
  });

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message_en: 'Fetched Urls',
    message: '',
    data: result,
  });
});
