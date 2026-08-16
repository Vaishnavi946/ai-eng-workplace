import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/AuthIllustration';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data, res.data.token);
      navigate('/sprints');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Left branding panel */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <span className="font-display font-semibold text-lg text-text mb-10">
          AI Eng Workplace
        </span>
        <h1 className="font-display text-3xl font-semibold text-text mb-3 max-w-sm">
          Join the workspace.
        </h1>
        <p className="text-text-muted max-w-sm mb-10">
          Create sprints, triage PRs with AI, and search your docs in seconds.
        </p>

        <AuthIllustration />
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Tab switcher */}
          <div className="flex border-b border-border mb-8">
            <Link
              to="/login"
              className="flex-1 text-center py-3 text-sm font-medium text-text-muted hover:text-text transition-colors"
            >
              Log in
            </Link>
            <span className="flex-1 text-center py-3 text-sm font-medium text-accent border-b-2 border-accent">
              Sign up
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-rose text-sm mb-4 text-center bg-rose/10 border border-rose/20 rounded-md py-2 px-3">
                {error}
              </p>
            )}

            <label className="block text-xs text-text-muted mb-1.5">Full name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-border rounded-md p-2.5 mb-4 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
              required
            />

            <label className="block text-xs text-text-muted mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-border rounded-md p-2.5 mb-4 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
              required
            />

            <label className="block text-xs text-text-muted mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-border rounded-md p-2.5 mb-6 text-sm text-text placeholder:text-text-dim focus:border-accent outline-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-accent text-white py-2.5 rounded-md text-sm font-medium shadow-sm hover:bg-accent/90 hover:shadow-md transition-all"
            >
              Sign up
            </button>
          </form>

          <p className="text-sm text-center text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}