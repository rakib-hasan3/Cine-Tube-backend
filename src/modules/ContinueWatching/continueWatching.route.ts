import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ContinueWatchingController } from './continueWatching.controller';
import { ContinueWatchingValidation } from './continueWatching.validation';

const router = express.Router();

// POST /continue-watching
router.post(
  '/',
  auth(),
  validateRequest(ContinueWatchingValidation.updateProgressValidationSchema),
  ContinueWatchingController.updateProgress,
);

// GET /continue-watching
router.get(
  '/',
  auth(),
  ContinueWatchingController.getContinueWatchingList,
);

// DELETE /continue-watching/:movieId
router.delete(
  '/:movieId',
  auth(),
  ContinueWatchingController.removeManually,
);

export const ContinueWatchingRoutes = router;
