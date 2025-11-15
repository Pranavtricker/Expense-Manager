import { Router } from 'express';
import auth from '../middleware/auth.js';
import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const budgets = await Budget.find({ user: req.userId }).populate('category');
  res.json({ budgets });
});

router.post('/', async (req, res) => {
  const { categoryId, amount, period } = req.body;
  if (!categoryId || !amount || !period) return res.status(400).json({ message: 'Missing fields' });
  const budget = await Budget.findOneAndUpdate(
    { user: req.userId, category: categoryId, period },
    { amount },
    { upsert: true, new: true }
  );
  const populated = await Budget.findById(budget._id).populate('category');
  res.status(201).json({ budget: populated });
});

router.get('/usage', async (req, res) => {
  const { period = 'monthly' } = req.query;
  const now = new Date();
  const start = period === 'weekly'
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
    : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = period === 'weekly'
    ? new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
    : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const budgets = await Budget.find({ user: req.userId, period }).populate('category');
  const categoryIds = budgets.map((b) => b.category._id);
  const expenses = await Expense.aggregate([
    { $match: { user: req.userId, date: { $gte: start, $lte: end }, category: { $in: categoryIds } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);
  const usageMap = Object.fromEntries(expenses.map((e) => [String(e._id), e.total]));
  const usage = budgets.map((b) => ({
    category: b.category,
    budget: b.amount,
    spent: usageMap[String(b.category._id)] || 0,
    percent: Math.min(100, ((usageMap[String(b.category._id)] || 0) / b.amount) * 100)
  }));
  res.json({ usage });
});

export default router;