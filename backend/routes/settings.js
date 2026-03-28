import { Router } from 'express';
import { settingsController } from '../controllers/settingsController.js';

const router = Router();

router.get('/',         settingsController.getAll);
router.get('/:key',     settingsController.getOne);
router.put('/:key',     settingsController.update);

export default router;