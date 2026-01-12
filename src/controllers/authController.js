import { catchAsync } from '../utils/catchAsync.js';
import { sendResponse } from '../utils/response.js';
import { login, register } from '../services/authService.js';

export const registerUser = catchAsync(async (req, res) => {
  const result = await register(req.body);
  return sendResponse(res, {
    success: true,
    statusCode: 201,
    message: 'Registered successfully',
    data: result,
  });
});

export const loginUser = catchAsync(async (req, res) => {
  const result = await login(req.body);
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Login successful',
    data: result,
  });
});
