import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Category, Expense, NewExpense } from '../types';

type Props = {
  initial?: Expense | null;
  onSaved: () => void;
  onCancel?: () => void;
};

export default function ExpenseForm({ initial, onSaved, onCancel }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<NewExpense>({
    title: initial?.title || '',
    amount: initial?.amount || 0,
    categoryId: initial?.category?._id || '',
    date: initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    notes: initial?.notes || '',
    currency: initial?.currency || 'INR',
    receiptUrl: initial?.receiptUrl || ''
  });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories || res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const up = await api.post('/receipts/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        setForm((f) => ({ ...f, receiptUrl: up.data.url }));
      }
      if (initial?._id) {
        await api.put(`/expenses/${initial._id}`, {
          title: form.title,
          amount: form.amount,
          categoryId: form.categoryId,
          date: form.date,
          notes: form.notes,
          currency: form.currency,
          receiptUrl: form.receiptUrl
        });
      } else {
        await api.post('/expenses', form);
      }
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Amount</label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value || '0') }))}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Currency</label>
          <select value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-sm">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm">Receipt</label>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        {form.receiptUrl && (
          <div className="text-sm text-gray-400 mt-1">Uploaded: {form.receiptUrl}</div>
        )}
      </div>

        <div className="flex gap-2">
        <button disabled={loading} type="submit" className="btn-primary">
          {initial ? 'Update' : 'Add'} Expense
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}