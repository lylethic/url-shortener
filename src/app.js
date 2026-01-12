import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import urlRoutes from './routes/url.js';
import roleRoutes from './routes/role.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import swaggerSpec from './swagger.js';
import AppError from './utils/AppError.js';
import errorHandler from './middlewares/errorHandler.js';
import { redirectUrl } from './controllers/urlController.js';

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try agian later!' },
});

app.use('/api', apiLimiter);

/* ---------- Global middleware ---------- */
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// JSON body max 1mb
app.use(express.json({ limit: '1mb' }));

//
app.use(express.urlencoded({ limit: '1mb', extended: true }));

/* ---------- Routes ---------- */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

/* === Redirect to root url ( doesnot contains prefix /api) ===*/
app.get('/:shortId', redirectUrl); // đặt sau docs/other routes
/* */

app.use('/api', urlRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

/* === Redirect to root url ( doesnot contains prefix /api) ===*/
app.get('/:shortId', redirectUrl); // đặt sau /api routes
/* */

/* ---------- 404 handler ---------- */
// Express 5 (path-to-regexp v6) no longer accepts bare '*' patterns; default
// middleware without a path cleanly catches unmatched routes.
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

/* ---------- Global error handler ---------- */
app.use(errorHandler);

// proxy/load balancer (Nginx, Cloudflare, Render, Heroku…)
// app.set('trust proxy', 1);

export default app;
