import express from 'express';
import auth from '../../middlewares/auth';
import role from '../../middlewares/role';
import { AdminController } from './admin.controller';

const router = express.Router();

// সেটিংস গেট করার জন্য
router.get(
    '/settings',
    auth(),
    role('ADMIN'),
    AdminController.getSettings
);

// সেটিংস আপডেট করার জন্য
router.patch(
    '/settings',
    auth(),
    role('ADMIN'),
    AdminController.updateSettings
);

router.get('/stats', AdminController.getAdminStats);

export const AdminRoutes = router;