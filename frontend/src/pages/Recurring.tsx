import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Category } from '../types';

type Item = { _id: string; title: string; amount: number; category: Category; cadence: 'monthly'|'weekly'; nextDate: string; };

export default function Recurring() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [cadence, setCadence] = useState<'monthly'|'weekly'>('monthly');
  const [nextDate, setNextDate] = useState(new Date().toISOString().slice(0,10));

  const load = async () => {
    const r = await api.get('/recurring');
    setItems(r.data.items || []);
    const c = await api.get('/categories');
    setCategories(c.data.categories || c.data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!title || !amount || !categoryId || !nextDate) return;
    await api.post('/recurring', { title, amount: parseFloat(amount), categoryId, cadence, nextDate });
    setTitle(''); setAmount(''); setCategoryId('');
    load();
  };

  const run = async () => {
    await api.post('/recurring/run');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Category</option>
          {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
        </select>
        <select value={cadence} onChange={(e) => setCadence(e.target.value as 'monthly'|'weekly')}>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
        <div className="md:col-span-5 flex gap-2">
          <button className="btn-primary" onClick={add}>Add Recurring</button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white" onClick={run}>Run Due</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead><tr className="text-left text-gray-400"><th className="p-2">Title</th><th className="p-2">Category</th><th className="p-2">Amount</th><th className="p-2">Next Date</th></tr></thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}><td className="p-2">{it.title}</td><td className="p-2">{it.category?.name}</td><td className="p-2">₹{it.amount.toFixed(2)}</td><td className="p-2">{new Date(it.nextDate).toLocaleDateString()}</td></tr>
            ))}
            {items.length === 0 && (<tr><td colSpan={4} className="p-3 text-center text-gray-400">No recurring items</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
