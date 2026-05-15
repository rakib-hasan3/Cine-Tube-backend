import { Router } from 'express';
import { AiController } from './ai.controller';

const router = Router();

router.post('/cinetube-chat', AiController.cineTubeChat);

export const AiRoutes = router;
