import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Budgets from './pages/Budgets';
import Incomes from './pages/Incomes';
import Recurring from './pages/Recurring';
import Exports from './pages/Exports';
import Sidebar from './components/Sidebar';
import { useAuth } from './context/AuthContext';

function Protected({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 p-4 md:p-8 container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              }
            />
            <Route
              path="/expenses"
              element={
                <Protected>
                  <Expenses />
                </Protected>
              }
            />
            <Route
              path="/reports"
              element={
                <Protected>
                  <Reports />
                </Protected>
              }
            />
            <Route
              path="/budgets"
              element={
                <Protected>
                  <Budgets />
                </Protected>
              }
            />
            <Route
              path="/incomes"
              element={
                <Protected>
                  <Incomes />
                </Protected>
              }
            />
            <Route
              path="/recurring"
              element={
                <Protected>
                  <Recurring />
                </Protected>
              }
            />
            <Route
              path="/exports"
              element={
                <Protected>
                  <Exports />
                </Protected>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}