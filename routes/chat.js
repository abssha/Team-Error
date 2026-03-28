import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { validateChat } from '../middleware/validator.js';

const router = Router();

router.post('/', validateChat, chatController.chat);

export default router;