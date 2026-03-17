import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserDetail,
  getUsers,
  updateUser,
} from './user.controller';
import { requireAdmin } from '../../middlewares/admin.middleware';

const router = Router();

router.use(requireAdmin);

router.get('/', getUsers);
router.get('/:id', getUserDetail);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;