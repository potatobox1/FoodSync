// routes/inventoryRoutes.ts
import { Router } from 'express';
import { getInventory } from '../controller/InventoryController';

const router = Router();

// Fetch all food items or only available ones based on query
router.get('/', getInventory);

export default router;