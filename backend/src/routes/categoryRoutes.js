import { Router } from 'express';
import auth from '../middleware/auth.js';
import Category from '../models/Category.js';

const router = Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    let categories = await Category.find({});
    if (categories.length === 0) {
      const defaults = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Health'];
      await Category.insertMany(defaults.map((name) => ({ name })));
      categories = await Category.find({});
    }
    res.json({ categories });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

export default router;