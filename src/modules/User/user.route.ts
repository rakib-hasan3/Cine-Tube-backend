import express from 'express';
import auth from '../../middlewares/auth';
import role from '../../middlewares/role';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

router.get('/', auth(), role('ADMIN'), UserController.getAllUsers);

router.get('/:id', auth(), UserController.getSingleUser);

router.patch(
  '/:id',
  auth(),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser
);

router.delete('/:id', auth(), role('ADMIN'), UserController.deleteUser);
router.patch("/:id/status", auth(), UserController.updateStatus);
export const UserRoutes = router;
