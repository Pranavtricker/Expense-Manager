import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800/60'}`;

  return (
    <aside className="hidden md:block w-72 bg-gray-950/80 backdrop-blur border-r border-gray-800 min-h-screen p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Expense Manager</h1>
        <p className="text-sm text-gray-400">{user?.name}</p>
      </div>

      <nav className="space-y-1">
        <NavLink to="/dashboard" className={linkClass}>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/expenses" className={linkClass}>
          <span>Expenses</span>
        </NavLink>
        <NavLink to="/reports" className={linkClass}>
          <span>Reports</span>
        </NavLink>
        <NavLink to="/budgets" className={linkClass}>
          <span>Budgets</span>
        </NavLink>
        <NavLink to="/incomes" className={linkClass}>
          <span>Income</span>
        </NavLink>
        <NavLink to="/recurring" className={linkClass}>
          <span>Recurring</span>
        </NavLink>
        <NavLink to="/exports" className={linkClass}>
          <span>Export</span>
        </NavLink>
      </nav>

      <div className="mt-8">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full btn-secondary"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}