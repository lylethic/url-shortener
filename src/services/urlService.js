import Url from '../models/Url.js';
import { nanoid } from 'nanoid';
import AppError from '../utils/AppError.js';

export const createShortUrlService = async ({ originalUrl }) => {
  if (!originalUrl) {
    throw new AppError('Validation error', 400, [
      { field: 'originalUrl', message: 'Original URL is required' },
    ]);
  }

  try {
    new URL(originalUrl);
  } catch {
    throw new AppError('Validation error', 400, [
      { field: 'originalUrl', message: 'Invalid URL format' },
    ]);
  }

  let shortId;
  let exists = true;

  while (exists) {
    shortId = nanoid(7);
    exists = await Url.findOne({ shortId });
  }

  const doc = await Url.create({ shortId, originalUrl });

  return {
    shortId: doc.shortId,
    originalUrl: doc.originalUrl,
  };
};

export const redirectService = async ({ shortId }) => {
  const doc = await Url.findOne({ shortId });
  if (!doc) {
    throw new AppError('URL not found', 404);
  }

  doc.clicks++;
  await doc.save();

  return { originalUrl: doc.originalUrl };
};
