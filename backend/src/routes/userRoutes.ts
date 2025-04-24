// routes/userRoutes.ts
import { Router } from 'express';
import { getUserById, getAllUsers, testEndpoint } from '../controller/userController2';

const router = Router();

// Fetch all users
router.get('/', getAllUsers);

// Fetch a user by ID
router.get('/:id', getUserById);

// Test endpoint
router.get('/testing', testEndpoint);

export default router;
