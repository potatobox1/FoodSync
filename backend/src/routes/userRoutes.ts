import { Router } from 'express';
import { getUserById, getAllUsers, testEndpoint } from '../controller/userController2';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/testing', testEndpoint);

export default router;
