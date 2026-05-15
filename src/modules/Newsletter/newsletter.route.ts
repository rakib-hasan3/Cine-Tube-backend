import { Router } from 'express';
import { NewsletterController } from './newsletter.controller';

const router = Router();

router.post('/subscribe', NewsletterController.subscribeNewsletter);

export const NewsletterRoutes = router;
