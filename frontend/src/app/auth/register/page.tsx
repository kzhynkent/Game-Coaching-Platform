'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ErrorMessage from '@/components/ErrorMessage';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'player' | 'coach'>('player');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register(email, password, role);
    setLoading(false);
    if (res.success) {
      router.push(role === 'player' ? '/dashboard' : '/coaches/me');
    } else {
      setError(res.error || 'Registration failed.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="font-orbitron gradient-text" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Join GG Coach
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Create your free account in seconds
          </p>
        </div>

        {/* Role Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {(['player', 'coach'] as const).map((r) => (
            <button
              key={r}
              type="button"
              id={`role-${r}`}
              onClick={() => setRole(r)}
              style={{
                padding: '1.25rem',
                borderRadius: '10px',
                border: `1px solid ${role === r ? 'rgba(124,58,237,0.6)' : 'var(--border)'}`,
                background: role === r ? 'rgba(124,58,237,0.15)' : 'rgba(17,25,39,0.8)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>
                {r === 'player' ? '🎮' : '🏆'}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: role === r ? '#c4b5fd' : 'var(--text-primary)', textTransform: 'capitalize' }}>{r}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {r === 'player' ? 'Post coaching bounties' : 'Find & coach players'}
              </div>
            </button>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <ErrorMessage message={error} />}

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Email
              </label>
              <input
                id="register-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Password <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(min 8 chars)</span>
              </label>
              <input
                id="register-password"
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.875rem' }}
            >
              {loading ? 'Creating Account...' : `Create ${role.charAt(0).toUpperCase() + role.slice(1)} Account →`}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#c4b5fd', fontWeight: 600, textDecoration: 'none' }}>
            Log in →
          </Link>
        </p>
      </div>
    </div>
  );
}
