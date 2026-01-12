/**Email */
export const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : email;

export const isValidEmail = (email) =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isDupKeyError = (err) => err?.code === 11000;
