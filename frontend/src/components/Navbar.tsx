'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 w-full flex justify-center pointer-events-none">
      <nav className="pointer-events-auto flex items-center max-md:w-full max-md:justify-between border border-purple-500/30 bg-black/40 backdrop-blur-xl px-6 py-3.5 rounded-full text-white text-sm shadow-[0_4px_30px_rgba(124,58,237,0.1)] w-full max-w-7xl transition-all duration-300 hover:bg-black/60 hover:border-purple-500/50">
        
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity z-10 shrink-0">
          <div className="w-7 h-7 shrink-0 relative">
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
          <span className="font-orbitron font-black text-base tracking-wide bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent transform translate-y-[1px]">
            GG<span className="text-purple-400/70">COACH</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ─────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-8 ml-8">
          <AnimatedNavLink href="/bounty-board" active={isActive('/bounty-board')}>Bounty Board</AnimatedNavLink>
          <AnimatedNavLink href="/coaches" active={isActive('/coaches')}>Coaches</AnimatedNavLink>
          {user?.role === 'player' && <AnimatedNavLink href="/dashboard" active={isActive('/dashboard')}>My Requests</AnimatedNavLink>}
          {user?.role === 'coach' && <AnimatedNavLink href="/coaches/me" active={isActive('/coaches/me')}>My Profile</AnimatedNavLink>}
        </div>

        {/* ── Desktop Auth ──────────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end justify-center">
                <span className="text-xs text-slate-300 max-w-[140px] truncate leading-tight">{user.email}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 mt-0.5 rounded-sm ${
                  user.role === 'coach' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  {user.role}
                </span>
              </div>
              <button 
                onClick={handleLogout} 
                className="border border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-400 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 text-purple-100"
              >
                <LogOut size={16} className="mb-[1px]" />
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="border border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-400 text-purple-100 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:text-white">
                  Log In
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="bg-white hover:shadow-[0px_0px_25px_5px] hover:shadow-purple-500/40 shadow-[0px_0px_15px_2px] shadow-purple-500/20 text-black px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:bg-slate-100 hover:scale-105 active:scale-95">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Menu Toggle ────────────────────────────────────────── */}
        <button 
          className="md:hidden text-slate-300 hover:text-white z-10 p-1 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* ── Mobile Menu Dropdown ──────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="absolute top-[110%] left-0 right-0 max-w-[calc(100vw-32px)] mx-auto bg-[#0a071a]/98 backdrop-blur-2xl border border-purple-500/30 rounded-2xl flex flex-col p-6 gap-4 md:hidden shadow-[0_20px_60px_rgba(124,58,237,0.3)] animate-in slide-in-from-top-4 fade-in duration-200">
            <MobileNavLink href="/bounty-board" onClick={() => setIsMobileMenuOpen(false)}>Bounty Board</MobileNavLink>
            <MobileNavLink href="/coaches" onClick={() => setIsMobileMenuOpen(false)}>Coaches</MobileNavLink>
            {user?.role === 'player' && <MobileNavLink href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>My Requests</MobileNavLink>}
            {user?.role === 'coach' && <MobileNavLink href="/coaches/me" onClick={() => setIsMobileMenuOpen(false)}>My Profile</MobileNavLink>}
            
            <div className="h-px bg-purple-500/20 my-2 w-full" />
            
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-200 truncate">{user.email}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                    user.role === 'coach' ? 'bg-purple-500/20 text-purple-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full border border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-400 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 text-purple-100"
                >
                  <LogOut size={16} className="mb-[1px]" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <button className="w-full border border-purple-500/40 hover:bg-purple-500/20 hover:border-purple-400 text-purple-100 py-3 rounded-full text-sm font-medium transition-all duration-300">
                    Log In
                  </button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <button className="w-full bg-white hover:shadow-[0px_0px_20px_5px] hover:shadow-purple-500/30 text-black py-3 rounded-full text-sm font-bold transition-all duration-300 hover:bg-slate-100">
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}

function AnimatedNavLink({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <Link href={href} className="relative group overflow-hidden flex flex-col h-[28px] text-sm items-center justify-start rounded-md">
      <span className={`h-[28px] w-full shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-full font-medium ${
        active ? 'text-purple-300 drop-shadow-md' : 'text-slate-300'
      }`}>
        {children}
      </span>
      <span className="h-[28px] w-full shrink-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-full text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
        {children}
      </span>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className="text-base font-medium text-slate-200 hover:text-purple-300 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </Link>
  );
}

