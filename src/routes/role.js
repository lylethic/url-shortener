import express from 'express';
import {
  createRole,
  getRoleById,
  getAllRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController.js';
import { requireAuth, requireRoleName } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', requireAuth, getAllRole);
router.get('/:id', requireAuth, getRoleById);
router.post('/', requireAuth, requireRoleName('admin'), createRole);
router.patch('/:id', requireAuth, requireRoleName('admin'), updateRole);
router.delete('/:id', requireAuth, requireRoleName('admin'), deleteRole);

export default router;
