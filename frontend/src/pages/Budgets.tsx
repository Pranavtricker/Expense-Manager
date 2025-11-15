import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Budget, Category } from '../types';

type Usage = { category: Category; budget: number; spent: number; percent: number };

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [usage, setUsage] = useState<Usage[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => {
    const b = await api.get('/budgets');
    setBudgets(b.data.budgets || []);
    const u = await api.get('/budgets/usage', { params: { period } });
    setUsage(u.data.usage || []);
    const c = await api.get('/categories');
    setCategories(c.data.categories || c.data);
  };

  useEffect(() => { load(); }, [period]);

  const save = async () => {
    if (!categoryId || !amount) return;
    await api.post('/budgets', { categoryId, amount: parseFloat(amount), period });
    setCategoryId(''); setAmount('');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select</option>
            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 text-sm">Period</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value as 'monthly' | 'weekly')}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div className="flex items-end"><button className="btn-primary" onClick={save}>Save Budget</button></div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Usage</h3></div>
        <div className="space-y-3">
          {usage.map((u) => (
            <div key={u.category._id}>
              <div className="flex justify-between text-sm mb-1">
                <span>{u.category.name}</span>
                <span>₹{u.spent.toFixed(2)} / ₹{u.budget.toFixed(2)} ({Math.round(u.percent)}%)</span>
              </div>
              <div className="w-full bg-gray-800 rounded h-2">
                <div className={`h-2 rounded ${u.percent >= 100 ? 'bg-red-600' : u.percent >= 80 ? 'bg-yellow-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, u.percent)}%` }} />
              </div>
            </div>
          ))}
          {usage.length === 0 && <div className="text-gray-400">No budgets</div>}
        </div>
      </div>
    </div>
  );
}