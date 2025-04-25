
import { Router } from 'express';
import { getLocationById } from '../controller/locationController';

const router = Router();


router.get('/:id', getLocationById);

export default router;
