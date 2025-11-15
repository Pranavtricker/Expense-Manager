import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getMonthlySummary } from '../controllers/expenseController.js';

const router = Router();

router.use(auth);

router.get('/monthly', getMonthlySummary);

export default router;