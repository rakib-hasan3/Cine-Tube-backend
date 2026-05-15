import { Router } from 'express';
import { ContactController } from './contact.controller';

const router = Router();

router.post('/send', ContactController.sendContactEmail);

export const ContactRoutes = router;
