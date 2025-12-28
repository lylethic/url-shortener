import { sendResponse } from '../utils/response.js';

export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  return sendResponse(res, {
    success: false,
    statusCode,
    message: err.message || 'Lỗi máy chủ nội bộ',
    message_en: err.message_en || 'Internal Server Error',
    data: null,
    errors: err.errors || [],
  });
}
