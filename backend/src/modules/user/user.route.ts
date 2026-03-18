  import { Router } from 'express';
  import {
    activateUser,
    createUser,
    deleteUser,
    getUserDetail,
    getUsers,
    suspendUser,
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
  router.patch('/:id/suspend', suspendUser);
  router.patch('/:id/activate', activateUser);
  export default router;