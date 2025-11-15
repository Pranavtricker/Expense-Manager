import api from '../utils/api';

export default function Exports() {
  const download = async (path: string, filename: string) => {
    const res = await api.get(path, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="card-header"><h3 className="card-title">Export Data</h3></div>
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => download('/exports/expenses.csv', 'expenses.csv')}>Download CSV</button>
        <button className="btn-secondary" onClick={() => download('/exports/summary.pdf', 'summary.pdf')}>Download PDF</button>
      </div>
    </div>
  );
}
