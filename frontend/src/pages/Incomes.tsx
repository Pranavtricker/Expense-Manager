import { useEffect, useState } from 'react';
import api from '../utils/api';
import type { Income } from '../types';

export default function Incomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  const load = async () => {
    const { data } = await api.get('/incomes');
    setIncomes(data.incomes || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!source || !amount || !date) return;
    await api.post('/incomes', { source, amount: parseFloat(amount), date });
    setSource(''); setAmount('');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="card grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block mb-1 text-sm">Source</label>
          <input value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 text-sm">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 text-sm">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex items-end"><button className="btn-primary" onClick={add}>Add Income</button></div>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="p-2">Source</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((i) => (
              <tr key={i._id}>
                <td className="p-2">{i.source}</td>
                <td className="p-2">₹{i.amount.toFixed(2)}</td>
                <td className="p-2">{new Date(i.date).toLocaleDateString()}</td>
              </tr>
            ))}
            {incomes.length === 0 && (
              <tr><td colSpan={3} className="p-3 text-center text-gray-400">No income entries</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}