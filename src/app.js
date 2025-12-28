import express from 'express';
import cors from 'cors';
import urlRoutes from './routes/url.js';
import AppError from './utils/AppError.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

/* ---------- Global middleware ---------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

/* ---------- Routes ---------- */
app.use('/', urlRoutes);

/* ---------- 404 handler ---------- */
// Express 5 (path-to-regexp v6) no longer accepts bare '*' patterns; default
// middleware without a path cleanly catches unmatched routes.
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

/* ---------- Global error handler ---------- */
app.use(errorHandler);

export default app;
