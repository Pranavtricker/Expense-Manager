import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 card">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      {err && <div className="bg-red-600 text-white p-2 rounded mb-3">{err}</div>}
      <form onSubmit={handle} className="space-y-3">
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button disabled={loading} className="btn-primary w-full" type="submit">
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      <p className="text-sm text-gray-400 mt-3">
        Already have an account? <Link to="/login" className="text-primary">Login</Link>
      </p>
    </div>
  );
}