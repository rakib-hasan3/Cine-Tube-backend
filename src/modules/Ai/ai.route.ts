import { Router } from 'express';
import { AiController } from './ai.controller';

const router = Router();

router.post('/hybrid-chat', AiController.hybridChat);

export const AiRoutes = router;
