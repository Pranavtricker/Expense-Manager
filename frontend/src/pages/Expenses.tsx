import { useEffect, useState } from 'react';
import api from '../utils/api';
import Filters from '../components/Filters';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import type { Expense } from '../types';

export default function Expenses() {
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/expenses', {
      params: { q, categoryId, startDate, endDate, sortBy, order, minAmount, maxAmount }
    });
    setExpenses(data.expenses || data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, categoryId, startDate, endDate, sortBy, order]);

  const onDelete = async (id: string) => {
    await api.delete(`/expenses/${id}`);
    load();
  };

  return (
    <div className="space-y-4">
      <Filters
        q={q}
        setQ={setQ}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        minAmount={minAmount}
        setMinAmount={setMinAmount}
        maxAmount={maxAmount}
        setMaxAmount={setMaxAmount}
      />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expenses</h3>
          <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Add Expense</button>
        </div>
        {showForm && (
          <ExpenseForm
            initial={editing}
            onSaved={() => { setShowForm(false); setEditing(null); load(); }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        )}
      </div>

      <ExpenseList
        expenses={expenses}
        onEdit={(e) => { setEditing(e); setShowForm(true); }}
        onDelete={onDelete}
      />
    </div>
  );
}