import { Router } from 'express';
import { getInventory } from '../controller/InventoryController';

const router = Router();

router.get('/', getInventory);

export default router;