'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 bg-[#03020f]/85 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 shrink-0 relative">
            <svg viewBox="0 0 34 34" fill="none" className="w-full h-full">
              <path d="M17 2L31 9.5V24.5L17 32L3 24.5V9.5L17 2Z" fill="url(#hexGrad)" fillOpacity="0.15" stroke="url(#hexStroke)" strokeWidth="1.2" />
              <rect x="15.2" y="10" width="3.6" height="14" rx="1.8" fill="url(#iconGrad)" fillOpacity="0.9" />
              <rect x="10" y="15.2" width="14" height="3.6" rx="1.8" fill="url(#iconGrad)" fillOpacity="0.9" />
              <circle cx="17" cy="17" r="2.2" fill="#a78bfa" />
              <defs>
                <linearGradient id="hexGrad" x1="3" y1="2" x2="31" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed" /><stop offset="1" stopColor="#06b6d4" /></linearGradient>
                <linearGradient id="hexStroke" x1="3" y1="2" x2="31" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed" stopOpacity="0.8" /><stop offset="1" stopColor="#06b6d4" stopOpacity="0.8" /></linearGradient>
                <linearGradient id="iconGrad" x1="10" y1="10" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#a78bfa" /><stop offset="1" stopColor="#60a5fa" /></linearGradient>
              </defs>
            </svg>
          </div>

          <span className="font-orbitron font-black text-lg tracking-wide bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
            GG<span className="text-purple-400/70">COACH</span>
          </span>
        </Link>

        {/* ── Nav Links ─────────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/bounty-board" active={isActive('/bounty-board')}>Bounty Board</NavLink>
          <NavLink href="/coaches" active={isActive('/coaches')}>Coaches</NavLink>

          {user?.role === 'player' && <NavLink href="/dashboard" active={isActive('/dashboard')}>My Requests</NavLink>}
          {user?.role === 'coach' && <NavLink href="/coaches/me" active={isActive('/coaches/me')}>My Profile</NavLink>}
        </div>

        {/* ── Auth ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-slate-400 max-w-[140px] truncate">{user.email}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 mt-0.5 rounded ${
                  user.role === 'coach' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {user.role}
                </span>
              </div>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <button className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-5 py-2 text-sm font-bold text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    boxShadow: '0 0 20px rgba(124,58,237,0.3)',
                  }}>
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} 
      className={`px-3.5 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
        active 
          ? 'text-purple-300 bg-purple-500/10 shadow-[inset_0_-1px_0_rgba(168,85,247,0.4)]' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}

