import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';

const router = express.Router();

// POST /api/v1/comments  — authenticated users only
router.post(
  '/',
  auth(),
  validateRequest(CommentValidation.createCommentValidationSchema),
  CommentController.createComment,
);

// GET /api/v1/comments/:reviewId  — public
router.get('/:reviewId', CommentController.getCommentsByReview);

export const CommentRoutes = router;
