import { Router } from 'express';
import logparser from './logparser';

const router = Router();

router.use('/parse-logs', logparser);

export default router;