import { Router } from 'express';
import auth from '../middleware/auth.js';
import Income from '../models/Income.js';

const router = Router();
router.use(auth);

router.get('/', async (req, res) => {
  const incomes = await Income.find({ user: req.userId }).sort({ date: -1 });
  res.json({ incomes });
});

router.post('/', async (req, res) => {
  const { source, amount, date } = req.body;
  if (!source || !amount || !date) return res.status(400).json({ message: 'Missing fields' });
  const income = await Income.create({ user: req.userId, source, amount, date: new Date(date) });
  res.status(201).json({ income });
});

router.get('/summary', async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
  const year = parseInt(req.query.year, 10) || now.getFullYear();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  const incomes = await Income.find({ user: req.userId, date: { $gte: start, $lte: end } });
  const total = incomes.reduce((s, i) => s + i.amount, 0);
  res.json({ total });
});

export default router;