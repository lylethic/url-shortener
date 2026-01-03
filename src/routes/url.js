import express from 'express';
import {
  createShortUrl,
  redirectUrl,
  getAllUrl,
} from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/urls', getAllUrl);
router.get('/:shortId', redirectUrl);

export default router;
