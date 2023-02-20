import express from 'express';

const router = express.Router();

router.get('/api/v1/healthcheck', (req, res) => res.sendStatus(200));

export default router;
