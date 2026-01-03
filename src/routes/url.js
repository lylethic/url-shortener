import express from 'express';
import {
  createShortUrl,
  redirectUrl,
  getAllUrl,
  deleteItemAsync,
} from '../controllers/urlController.js';

const router = express.Router();

router.get('/shorten', getAllUrl);
router.post('/shorten', createShortUrl);

router.get('/:shortId', redirectUrl);

// hard delete
router.delete('/shorten/:id', deleteItemAsync);

export default router;
