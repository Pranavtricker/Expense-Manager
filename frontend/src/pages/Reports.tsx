import { useEffect, useState } from 'react';
import api from '../utils/api';
import ChartCard from '../components/ChartCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Summary = {
  total: number;
  byCategory: Record<string, number>;
  comparison: { previousMonth: number };
};

export default function Reports() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [summary, setSummary] = useState<Summary | null>(null);

  const load = async () => {
    const { data } = await api.get('/reports/monthly', { params: { month, year } });
    setSummary(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const data = summary
    ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div className="card grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block mb-1 text-sm">Month</label>
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value, 10))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Year</label>
          <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10) || year)} />
        </div>
        <div>
          <div className="text-sm text-gray-400">Total</div>
          <div className="text-2xl">₹{(summary?.total || 0).toFixed(2)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Previous Month</div>
          <div className="text-2xl">₹{(summary?.comparison.previousMonth || 0).toFixed(2)}</div>
        </div>
      </div>

      <ChartCard title="Category Distribution">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}