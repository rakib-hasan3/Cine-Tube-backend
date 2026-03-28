import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { WatchlistController } from './watchlist.controller';
import { WatchlistValidation } from './watchlist.validation';

const router = express.Router();

// POST /api/v1/watchlist
router.post(
  '/',
  auth(),
  validateRequest(WatchlistValidation.addToWatchlistValidationSchema),
  WatchlistController.addToWatchlist,
);

// GET /api/v1/watchlist
router.get('/', auth(), WatchlistController.getWatchlist);

// DELETE /api/v1/watchlist/:id
router.delete('/:id', auth(), WatchlistController.removeFromWatchlist);

export const WatchlistRoutes = router;
