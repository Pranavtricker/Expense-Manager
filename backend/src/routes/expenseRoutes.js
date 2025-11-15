import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createExpense, getExpenses, updateExpense, deleteExpense } from '../controllers/expenseController.js';

const router = Router();

router.use(auth);

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;