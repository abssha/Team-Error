import { Router } from 'express';
import { roomController } from '../controllers/roomController.js';

const router = Router();

router.get('/',        roomController.getAll);
router.get('/:id',     roomController.getById);
router.post('/',       roomController.create);
router.put('/:id',     roomController.update);
router.delete('/:id',  roomController.delete);

export default router;