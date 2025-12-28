import { catchAsync } from '../utils/catchAsync.js';
import {
  createShortUrlService,
  redirectService,
} from '../services/urlService.js';
import { sendResponse } from '../utils/response.js';

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
  const { originalUrl } = await redirectService({
    shortId: req.params.shortId,
  });
  res.redirect(originalUrl);
});
