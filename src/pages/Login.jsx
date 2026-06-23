import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { RiGoogleFill } from 'react-icons/ri';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/map');
    } catch (err) {
      toast.error(err.message.replace('Firebase: ', '').replace(' (auth/invalid-credential).', ''));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google!');
      navigate('/map');
    } catch (err) {
      toast.error('Google sign-in failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="w-full max-w-sm fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-3xl font-extrabold mb-1">⬡ CampusNav</p>
          <p className="text-[var(--muted)] text-sm">Sign in to continue</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-[var(--muted)] font-medium block mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field" placeholder="you@college.edu" required />
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] font-medium block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 mt-1">
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <hr className="flex-1" />
            <span className="text-xs text-[var(--muted)]">or</span>
            <hr className="flex-1" />
          </div>

          <button onClick={handleGoogle} disabled={loading} className="btn-ghost w-full flex items-center justify-center gap-2">
            <RiGoogleFill size={16} /> Continue with Google
          </button>

          <p className="text-center text-xs text-[var(--muted)] mt-4">
            No account?{' '}
            <Link to="/signup" className="text-[var(--accent)] font-semibold hover:underline">Sign up</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-4">
          Admin demo: <span className="font-mono">admin@example.com</span>
        </p>
      </div>
    </div>
  );
}
