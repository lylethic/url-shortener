import express from 'express';
import { createShortUrl, redirectUrl } from '../controllers/urlController.js';

const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/:shortId', redirectUrl);

export default router;
