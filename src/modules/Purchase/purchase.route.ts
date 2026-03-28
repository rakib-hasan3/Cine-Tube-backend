import express from 'express';
import auth from '../../middlewares/auth';
import role from '../../middlewares/role';
import validateRequest from '../../middlewares/validateRequest';
import { PurchaseController } from './purchase.controller';
import { PurchaseValidation } from './purchase.validation';

const router = express.Router();

// POST /api/v1/purchases  — create a purchase (authenticated)
router.post(
  '/',
  auth(),
  validateRequest(PurchaseValidation.createPurchaseValidationSchema),
  PurchaseController.createPurchase,
);

// GET /api/v1/purchases  — personal history (authenticated)
router.get('/', auth(), PurchaseController.getPurchaseHistory);

// GET /api/v1/purchases/all  — ADMIN: all purchases
router.get('/all', auth(), role('ADMIN'), PurchaseController.getAllPurchases);

export const PurchaseRoutes = router;
