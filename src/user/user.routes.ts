import express from 'express';

const router = express.Router();

router.post('/api/v1/users', (req, res) => res.sendStatus(200));

export default router;
