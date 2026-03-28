import { Router } from 'express';
import { applianceController } from '../controllers/applianceController.js';

const router = Router({ mergeParams: true }); // mergeParams lets us access :id from rooms/:id/appliances

// Nested: POST /api/rooms/:id/appliances
router.post('/:id/appliances', applianceController.create);

// Flat: PUT /api/appliances/:id  |  DELETE /api/appliances/:id
router.put('/:id',    applianceController.update);
router.delete('/:id', applianceController.delete);

export default router;