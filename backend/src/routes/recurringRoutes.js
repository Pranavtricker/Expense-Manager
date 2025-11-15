import { Router } from 'express';
import auth from '../middleware/auth.js';
import RecurringExpense from '../models/RecurringExpense.js';
import Expense from '../models/Expense.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const items = await RecurringExpense.find({ user: req.userId }).populate('category');
  res.json({ items });
});

router.post('/', async (req, res) => {
  const { title, amount, categoryId, cadence, nextDate } = req.body;
  if (!title || !amount || !categoryId || !cadence || !nextDate) return res.status(400).json({ message: 'Missing fields' });
  const item = await RecurringExpense.create({ user: req.userId, title, amount, category: categoryId, cadence, nextDate: new Date(nextDate) });
  const populated = await RecurringExpense.findById(item._id).populate('category');
  res.status(201).json({ item: populated });
});

router.post('/run', async (req, res) => {
  const now = new Date();
  const items = await RecurringExpense.find({ user: req.userId, active: true, nextDate: { $lte: now } });
  const created = [];
  for (const it of items) {
    const exp = await Expense.create({ title: it.title, amount: it.amount, category: it.category, date: it.nextDate, user: req.userId });
    created.push(exp);
    const next = new Date(it.nextDate);
    if (it.cadence === 'monthly') next.setMonth(next.getMonth() + 1);
    if (it.cadence === 'weekly') next.setDate(next.getDate() + 7);
    it.nextDate = next;
    await it.save();
  }
  res.json({ created });
});

export default router;