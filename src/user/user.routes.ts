import express from 'express';
import validateResource from '../middleware/validateResource';
import { createUserHander } from './user.controller';
import { createUserSchema } from './user.schema';

const router = express.Router();

router.post(
  '/api/v1/users',
  validateResource(createUserSchema),
  createUserHander
);

export default router;
