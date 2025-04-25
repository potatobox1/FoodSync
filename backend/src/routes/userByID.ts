// routes/userRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { getUserById } from '../controller/userController';

const router = Router();

// Fetch a user by ID
router.get('/:id', getUserById);

export default router;