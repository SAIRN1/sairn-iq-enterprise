import { Router } from 'express';

const router = Router();
const auditLog = [];

router.get('/', (req, res) => {
  res.status(200).json({
    entries: auditLog.slice(-100),
    total: auditLog.length,
  });
});

export default router;
