// controllers/expenseController.js
import Expense from '../models/Expense.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

export const createExpense = async (req, res) => {
  try {
    const { title, amount, categoryId, date, notes } = req.body;
    if (!title || !amount || !categoryId || !date) return res.status(400).json({ message: 'Missing fields' });

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const expense = await Expense.create({
      title,
      amount,
      category: category._id,
      date: new Date(date),
      notes,
      user: req.userId
    });
    res.status(201).json({ expense });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create expense' });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { q, categoryId, startDate, endDate, sortBy = 'date', order = 'desc', minAmount, maxAmount } = req.query;
    const filter = { user: req.userId };

    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { notes: new RegExp(q, 'i') }
      ];
    }

    if (categoryId && mongoose.isValidObjectId(categoryId)) {
      filter.category = categoryId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    const sort = {};
    sort[sortBy === 'amount' ? 'amount' : 'date'] = order === 'asc' ? 1 : -1;

    const expenses = await Expense.find(filter).populate('category').sort(sort);

    res.json({ expenses });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, categoryId, date, notes } = req.body;
    const expense = await Expense.findOne({ _id: id, user: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      expense.category = categoryId;
    }

    if (title !== undefined) expense.title = title;
    if (amount !== undefined) expense.amount = amount;
    if (date !== undefined) expense.date = new Date(date);
    if (notes !== undefined) expense.notes = notes;

    await expense.save();
    const populated = await Expense.findById(expense._id).populate('category');
    res.json({ expense: populated });
  } catch (e) {
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.userId });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

// Monthly summary: totals + category-wise distribution + comparison with previous month
export const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month, 10) || now.getMonth() + 1; // 1-12
    const year = parseInt(req.query.year, 10) || now.getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      user: req.userId,
      date: { $gte: start, $lte: end }
    }).populate('category');

    const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    const byCategory = expenses.reduce((acc, e) => {
      const name = e.category?.name || 'Uncategorized';
      acc[name] = (acc[name] || 0) + (e.amount || 0);
      return acc;
    }, {});

    const prevStart = new Date(year, month - 2, 1);
    const prevEnd = new Date(year, month - 1, 0, 23, 59, 59, 999);
    const prevExpenses = await Expense.find({
      user: req.userId,
      date: { $gte: prevStart, $lte: prevEnd }
    });
    const previousMonth = prevExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    res.json({
      total,
      byCategory,
      comparison: { previousMonth }
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch monthly summary' });
  }
};