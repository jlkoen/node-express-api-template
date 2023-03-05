import express from 'express';
import validateResource from '../middleware/validateResource';
import { createUserHander, verifyUserHander } from './user.controller';
import { createUserSchema } from './user.schema';

const router = express.Router();

router.post(
  '/api/v1/users',
  validateResource(createUserSchema),
  createUserHander
);

router.post('/api/v1/users/verify/:id/:verificationCode', verifyUserHander);
export default router;
