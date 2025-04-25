// routes/locationRoutes.ts
import { Router } from 'express';
import { getLocationById } from '../controller/locationController';

const router = Router();

// Fetch a location by ID
router.get('/:id', getLocationById);

export default router;
