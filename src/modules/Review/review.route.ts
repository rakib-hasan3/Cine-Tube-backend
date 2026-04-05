import express from 'express';
import auth from '../../middlewares/auth';
import role from '../../middlewares/role';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import { ReviewValidation } from './review.validation';

const router = express.Router();

// POST /api/v1/reviews  — authenticated users can submit a review
router.post(
  '/',
  auth(),
  validateRequest(ReviewValidation.createReviewValidationSchema),
  ReviewController.createReview,
);

// GET /api/v1/reviews/:mediaId  — public, returns only APPROVED reviews
router.get('/:mediaId', ReviewController.getReviewsByMedia);

// PATCH /api/v1/reviews/:id  — owner can update their own review
router.patch(
  '/:id',
  auth(),
  validateRequest(ReviewValidation.updateReviewValidationSchema),
  ReviewController.updateReview,
);

// DELETE /api/v1/reviews/:id  — owner or admin can delete
router.delete('/:id', auth(), ReviewController.deleteReview);

// PATCH /api/v1/reviews/:id/status  — ADMIN only moderation
router.patch(
  '/:id/status',
  auth(),
  role('ADMIN'),
  validateRequest(ReviewValidation.updateReviewStatusValidationSchema),
  ReviewController.updateReviewStatus,
);

// GET /api/v1/reviews — ADMIN only, returns ALL reviews for moderation
router.get(
  '/',
  auth(),
  role('ADMIN'),

  ReviewController.getAllReviews,
);
export const ReviewRoutes = router;
