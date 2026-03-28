import express from 'express';
import auth from '../../middlewares/auth';
import role from '../../middlewares/role';
import validateRequest from '../../middlewares/validateRequest';
import { MediaController } from './media.controller';
import { MediaValidation } from './media.validation';

const router = express.Router();

// Public routes — anyone can read
router.get('/', MediaController.getAllMedia);
router.get('/:id', MediaController.getSingleMedia);

// Admin-only routes
router.post(
  '/',
  auth(),
  role('ADMIN'),
  validateRequest(MediaValidation.createMediaValidationSchema),
  MediaController.createMedia,
);

router.patch(
  '/:id',
  auth(),
  role('ADMIN'),
  validateRequest(MediaValidation.updateMediaValidationSchema),
  MediaController.updateMedia,
);

router.delete('/:id', auth(), role('ADMIN'), MediaController.deleteMedia);

export const MediaRoutes = router;
