import { Router } from 'express';
import auth from '../middleware/auth.js';
import Expense from '../models/Expense.js';
import PDFDocument from 'pdfkit';

const router = Router();
router.use(auth);

router.get('/expenses.csv', async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).populate('category').sort({ date: -1 });
  const header = 'Title,Category,Amount,Currency,Date,Notes\n';
  const rows = expenses.map((e) => [e.title, e.category?.name || '', e.amount, e.currency || 'INR', new Date(e.date).toISOString().slice(0,10), (e.notes || '').replace(/\n/g, ' ')].join(','));
  const csv = header + rows.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send(csv);
});

router.get('/summary.pdf', async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).populate('category');
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => { const k = e.category?.name || 'Uncategorized'; acc[k] = (acc[k] || 0) + e.amount; return acc; }, {});
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.fontSize(18).text('Expense Summary');
  doc.moveDown();
  doc.fontSize(12).text(`Total: ₹${total.toFixed(2)}`);
  doc.moveDown();
  doc.text('By Category:');
  Object.entries(byCategory).forEach(([k, v]) => doc.text(`${k}: ₹${v.toFixed(2)}`));
  doc.end();
});

export default router;