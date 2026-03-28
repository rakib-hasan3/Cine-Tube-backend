import express from 'express';
import auth from '../../middlewares/auth';
import { LikeController } from './like.controller';

const router = express.Router();

// POST   /api/v1/reviews/:id/like
router.post('/:id/like', auth(), LikeController.likeReview);

// DELETE /api/v1/reviews/:id/like
router.delete('/:id/like', auth(), LikeController.unlikeReview);

export const LikeRoutes = router;
