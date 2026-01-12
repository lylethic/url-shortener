import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  getUserByEmail,
  updateUser,
} from '../controllers/userController.js';
import { requireAuth, requireRoleName } from '../middlewares/auth.js';

const router = express.Router();
router.get('/', getAllUser);
router.get('/by-email', getUserByEmail);
router.post('/', requireAuth, requireRoleName('admin'), createUser);
router.get('/:id', getUserById);
router.patch('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, deleteUser);

export default router;
