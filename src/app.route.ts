import express from 'express';
import user from './user/user.routes';

const router = express.Router();

router.get('/api/v1/healthcheck', (req, res) => res.sendStatus(200));

router.use(user);

export default router;
