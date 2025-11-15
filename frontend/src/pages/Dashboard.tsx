import { useEffect, useState } from 'react';
import api from '../utils/api';
import ChartCard from '../components/ChartCard';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Summary = {
  total: number;
  byCategory: Record<string, number>;
  comparison: { previousMonth: number };
};
type IncomeSummary = { total: number };

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#22d3ee', '#a78bfa', '#f97316'];

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [incomeTotal, setIncomeTotal] = useState<number>(0);

  useEffect(() => {
    api.get('/reports/monthly').then((res) => setSummary(res.data));
    api.get('/incomes/summary').then((res) => setIncomeTotal((res.data as IncomeSummary).total || 0));
  }, []);

  const data = summary
    ? Object.entries(summary.byCategory).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-4">
      <div className="grid-2">
        <div className="card">
          <h3 className="font-semibold mb-2">This Month Total</h3>
          <div className="text-3xl">₹{(summary?.total || 0).toFixed(2)}</div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Previous Month</h3>
          <div className="text-3xl">₹{(summary?.comparison.previousMonth || 0).toFixed(2)}</div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Income Total</h3>
          <div className="text-3xl">₹{incomeTotal.toFixed(2)}</div>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Net Balance</h3>
          <div className="text-3xl">₹{(incomeTotal - (summary?.total || 0)).toFixed(2)}</div>
        </div>
      </div>

      <ChartCard title="Spend by Category">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="value" data={data} label>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
