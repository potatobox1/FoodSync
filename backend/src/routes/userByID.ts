
import { Router, Request, Response, NextFunction } from 'express';
import { getUserById } from '../controller/userController';

const router = Router();


router.get('/:id', getUserById);

export default router;