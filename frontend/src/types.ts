export type Category = {
  _id: string;
  name: string;
};

export type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
  notes?: string;
  currency?: string;
  receiptUrl?: string;
};

export type NewExpense = {
  title: string;
  amount: number;
  categoryId: string;
  date: string;
  notes?: string;
  currency?: string;
  receiptUrl?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type Budget = {
  _id: string;
  category: Category;
  amount: number;
  period: 'monthly' | 'weekly';
};

export type Income = {
  _id: string;
  source: string;
  amount: number;
  date: string;
};