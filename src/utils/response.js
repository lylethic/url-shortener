export const sendResponse = (
  res,
  {
    success = true,
    statusCode = 200,
    message = 'Thành công',
    message_en = 'Success',
    data = null,
    errors = [],
  }
) => {
  return res.status(200).json({
    success,
    statusCode,
    message,
    message_en,
    data,
    errors,
  });
};
