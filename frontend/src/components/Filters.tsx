import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Category } from '../types';

type Props = {
  q: string;
  setQ: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  sortBy: 'date' | 'amount';
  setSortBy: (v: 'date' | 'amount') => void;
  order: 'asc' | 'desc';
  setOrder: (v: 'asc' | 'desc') => void;
  minAmount?: string;
  setMinAmount?: (v: string) => void;
  maxAmount?: string;
  setMaxAmount?: (v: string) => void;
};

export default function Filters({
  q, setQ, categoryId, setCategoryId,
  startDate, setStartDate, endDate, setEndDate,
  sortBy, setSortBy, order, setOrder,
  minAmount, setMinAmount, maxAmount, setMaxAmount
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories || res.data));
  }, []);

  return (
    <div className="card grid grid-cols-1 md:grid-cols-8 gap-3">
      <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <input type="number" placeholder="Min amount" value={minAmount || ''} onChange={(e) => setMinAmount && setMinAmount(e.target.value)} />
      <input type="number" placeholder="Max amount" value={maxAmount || ''} onChange={(e) => setMaxAmount && setMaxAmount(e.target.value)} />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}>
        <option value="date">Sort by Date</option>
        <option value="amount">Sort by Amount</option>
      </select>
      <select value={order} onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}>
        <option value="desc">Desc</option>
        <option value="asc">Asc</option>
      </select>
    </div>
  );
}