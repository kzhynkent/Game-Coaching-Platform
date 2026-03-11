'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      style={{
        background: 'rgba(8, 12, 20, 0.9)',
        borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span
            className="font-orbitron"
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.05em',
            }}
          >
            GG<span style={{ WebkitTextFillColor: '#7c3aed' }}>COACH</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink href="/bounty-board" active={isActive('/bounty-board')}>
            Bounty Board
          </NavLink>
          <NavLink href="/coaches" active={isActive('/coaches')}>
            Coaches
          </NavLink>

          {user && user.role === 'player' && (
            <NavLink href="/dashboard" active={isActive('/dashboard')}>
              My Requests
            </NavLink>
          )}

          {user && user.role === 'coach' && (
            <NavLink href="/coaches/me" active={isActive('/coaches/me')}>
              My Profile
            </NavLink>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user.email}
              </span>
              <span
                className="badge"
                style={{
                  background: user.role === 'coach'
                    ? 'rgba(124, 58, 237, 0.2)' : 'rgba(6, 182, 212, 0.15)',
                  color: user.role === 'coach' ? '#c4b5fd' : '#22d3ee',
                  border: `1px solid ${user.role === 'coach' ? 'rgba(124, 58, 237, 0.4)' : 'rgba(6, 182, 212, 0.3)'}`,
                  fontSize: '0.65rem',
                }}
              >
                {user.role}
              </span>
              <button className="btn-ghost" onClick={handleLogout} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  Log In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <span
        style={{
          display: 'inline-block',
          padding: '0.4rem 0.875rem',
          borderRadius: '8px',
          fontSize: '0.875rem',
          fontWeight: active ? 600 : 400,
          color: active ? '#c4b5fd' : 'var(--text-secondary)',
          background: active ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
      >
        {children}
      </span>
    </Link>
  );
}
