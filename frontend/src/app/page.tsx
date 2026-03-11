'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, ChevronRight, Zap, Users, Trophy, Star, TrendingUp, Shield, DollarSign, Eye, Target, Flame, Wallet, Layers, Clock } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────

const STATS = [
  { value: '2,400+', label: 'Active Bounties', icon: <Flame size={16} /> },
  { value: '180+', label: 'Pro Coaches', icon: <Star size={16} /> },
  { value: '14', label: 'Games Supported', icon: <Trophy size={16} /> },
];

const GAMES = [
  { name: 'Valorant', icon: '🎯', color: '#ff4655' },
  { name: 'League of Legends', icon: '⚔️', color: '#c89b3c' },
  { name: 'CS2', icon: '💣', color: '#f0c040' },
  { name: 'Overwatch 2', icon: '🔫', color: '#fa9c1e' },
  { name: 'Apex Legends', icon: '🔶', color: '#cd4220' },
  { name: 'Dota 2', icon: '🔮', color: '#9e2a2b' },
  { name: 'Rocket League', icon: '🚗', color: '#0082c8' },
  { name: 'Fortnite', icon: '⚡', color: '#00d4ff' },
];

const MOCK_BOUNTIES = [
  {
    game: 'Valorant',
    gameIcon: '🎯',
    gameColor: '#ff4655',
    rank: 'Diamond II',
    rankColor: '#818cf8',
    goal: 'Reach Immortal before next act ends. Need help with mid-round calling & agent selection.',
    budget: '$45/hr',
    sessions: 3,
    postedAgo: '12 min ago',
    isLive: true,
    contact: 'valorantpro_jay#1337',
    profile: 'Jay M.',
  },
  {
    game: 'CS2',
    gameIcon: '💣',
    gameColor: '#f0c040',
    rank: 'Legendary Eagle',
    rankColor: '#fbbf24',
    goal: 'Global Elite push. Spray control and utility usage are my biggest weaknesses right now.',
    budget: '$60/hr',
    sessions: 5,
    postedAgo: '34 min ago',
    isLive: true,
    contact: 'cs_grinder99#4521',
    profile: 'Marcus R.',
  },
  {
    game: 'League of Legends',
    gameIcon: '⚔️',
    gameColor: '#c89b3c',
    rank: 'Plat I',
    rankColor: '#38bdf8',
    goal: 'Jungle macro, objective control & wave management. Want to climb to Emerald this split.',
    budget: '$35/hr',
    sessions: 2,
    postedAgo: '1 hr ago',
    isLive: false,
    contact: 'loljungler_22#KR1',
    profile: 'Sena K.',
  },
];

const PLAYER_STEPS = [
  { icon: <Target size={22} />, step: '01', title: 'Post a Bounty', desc: 'Describe your rank, goals, and budget in under 2 minutes. No account required to browse.' },
  { icon: <Eye size={22} />, step: '02', title: 'Get Discovered', desc: 'Pro coaches actively browse the board and reach out to you directly. You sit back.' },
  { icon: <TrendingUp size={22} />, step: '03', title: 'Level Up', desc: 'Choose your coach, book your sessions, and climb the ladder. Pure coaching value.' },
];

const COACH_STEPS = [
  { icon: <Zap size={22} />, step: '01', title: 'Browse Live Leads', desc: 'See real players with real budgets actively requesting coaching right now — updated every minute.' },
  { icon: <Shield size={22} />, step: '02', title: 'Upgrade to Pro', desc: 'One flat monthly fee unlocks every contact. No per-lead charges. No bidding. No BS.' },
  { icon: <DollarSign size={22} />, step: '03', title: 'Keep 100% Revenue', desc: 'We never take a cut of your coaching sessions. Earn what you\'re worth, every time.' },
];

const PRICING_PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: "Browse the board. See what's out there.",
    features: [
      'View all bounty details',
      'See game & rank info',
      'See session goals & budget',
      'Contact info locked',
    ],
    cta: 'Get Started Free',
    ctaHref: '/auth/register?plan=free',
    highlighted: false,
  },
  {
    name: 'Pro Coach',
    price: '$39',
    period: 'mo',
    description: 'Unlock every lead. Grow your coaching business.',
    features: [
      'Unlimited contact unlocks',
      'Full Discord & profile access',
      'Priority listing in coach directory',
      'Verified Pro Coach badge',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaHref: '/auth/register?plan=pro',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: '$99',
    period: 'mo',
    description: 'Built for coaching organizations handling multiple rosters.',
    features: [
      'Unlimited contact unlocks',
      'Manage up to 5 coach profiles',
      'Organization directory listing',
      'Dedicated support channel',
    ],
    cta: 'Get Team Access',
    ctaHref: '/auth/register?plan=agency',
    highlighted: false,
  },
];

// ─── BountyCard Component ────────────────────────────────────────────────────

function BountyCard({ bounty, index }: { bounty: typeof MOCK_BOUNTIES[0]; index: number }) {
  return (
    <div className="bounty-card flex-shrink-0" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="card-accent-bar" style={{ background: `linear-gradient(90deg, ${bounty.gameColor} 0%, #7c3aed 60%, transparent 100%)` }} />

        {/* ── Header: Game + Rank + Live badge ── */}
        <div className="card-header">
          <div className="game-identity">
            <div className="game-icon-wrap" style={{ background: `${bounty.gameColor}1A`, border: `1px solid ${bounty.gameColor}33` }}>
              {bounty.gameIcon}
            </div>
            <div>
              <div className="game-name">{bounty.game}</div>
              <div className="rank-chip" style={{ background: `${bounty.rankColor}1A`, border: `1px solid ${bounty.rankColor}33`, color: bounty.rankColor }}>
                <span>💎</span> {bounty.rank}
              </div>
            </div>
          </div>
          {bounty.isLive && (
            <div className="live-pill">
              <span className="live-dot" />
              Live
            </div>
          )}
        </div>

        {/* ── Goal ── */}
        <div className="card-goal">
          <div className="goal-label">Goal</div>
          <p className="goal-text">{bounty.goal}</p>
        </div>

        {/* ── Stats strip ── */}
        <div className="card-stats">
          <div className="stat-cell">
            <div className="stat-icon-label">
              <Wallet size={9} /> Budget
            </div>
            <span className="stat-value budget">{bounty.budget}</span>
          </div>
          <div className="stat-cell">
            <div className="stat-icon-label">
              <Layers size={9} /> Sessions
            </div>
            <span className="stat-value sessions">{bounty.sessions}</span>
          </div>
          <div className="stat-cell">
            <div className="stat-icon-label">
              <Clock size={9} /> Posted
            </div>
            <span className="stat-value posted">{bounty.postedAgo}</span>
          </div>
        </div>

        {/* ── Contact (locked) ── */}
        <div className="card-contact">
          <div className="contact-label">Contact Info</div>
          <div className="contact-rows">
            <div className="contact-row">
              <div className="contact-row-left">
                <span className="contact-platform">💬</span>
                <span className="contact-blurred">{bounty.contact}</span>
              </div>
              <div className="lock-tag">
                <Lock size={10} /> Locked
              </div>
            </div>
            <div className="contact-row">
              <div className="contact-row-left">
                <span className="contact-platform">👤</span>
                <span className="contact-blurred">{bounty.profile}</span>
              </div>
              <div className="lock-tag">
                <Lock size={10} /> Locked
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="card-cta">
          <Link href="/auth/register?plan=pro#pricing" className="block w-full">
            <button className="cta-button">
              🔓 Subscribe to Unlock Lead
            </button>
          </Link>
        </div>
      </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'players' | 'coaches'>('players');
  const steps = activeTab === 'players' ? PLAYER_STEPS : COACH_STEPS;

  return (
    <div className="min-h-screen relative" style={{ background: '#03020f' }}>
      
      {/* ── Background Cyber Grid & Scanlines ── */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
        <div className="absolute inset-0 scanline opacity-30 mix-blend-overlay" />
      </div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', filter: 'blur(100px)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              ✦ THE PREMIER COACH MARKETPLACE
            </div>

            <h1 className="font-orbitron text-5xl xl:text-6xl font-black leading-[1.05] mb-6 tracking-tight glow-text">
              <span style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #a78bfa 100%)',
                backgroundSize: '200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Find Your</span>
              <br />
              <span className="text-white drop-shadow-lg">Competitive Edge</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed max-w-lg mb-10">
              Players post coaching bounties. Pro coaches claim them. No DMs, no Discord searches — just ranked results that convert.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link href="/bounty-board">
                <button className="group flex items-center justify-center gap-2 px-8 py-4 font-bold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] clip-chamfer relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    color: 'white',
                  }}>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute -left-10 top-0 bottom-0 w-8 bg-white opacity-20 skew-x-[-20deg] group-hover:translate-x-[400px] transition-transform duration-700 ease-in-out" />
                  Browse Bounties
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <a href="#pricing">
                <button className="px-8 py-4 font-bold text-base transition-all duration-200 hover:bg-white/5 clip-chamfer-reverse"
                  style={{ border: '1px solid rgba(139,92,246,0.6)', color: '#c4b5fd', background: 'rgba(15,10,40,0.5)', backdropFilter: 'blur(4px)' }}>
                  I&apos;m a Coach
                </button>
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-12 pt-10"
              style={{ borderTop: '1px solid rgba(139,92,246,0.15)' }}>
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="font-orbitron font-black text-lg leading-tight"
                      style={{
                        background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>{s.value}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Mock Bounty Card (hero preview) */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />

            {/* Floating card */}
            <div className="relative w-80 p-6 transition-transform duration-500 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(15,10,40,0.98), rgba(20,15,55,0.98))',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 60px rgba(139,92,246,0.2), 0 30px 60px rgba(0,0,0,0.5)',
              }}>
              {/* Live badge */}
              <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                LIVE BOUNTY
              </div>

              <div className="flex items-center gap-3 mt-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(255,70,85,0.1)', border: '1px solid rgba(255,70,85,0.3)' }}>🎯</div>
                <div>
                  <p className="font-bold text-white">Valorant</p>
                  <p className="text-xs text-purple-300">💎 Diamond II → Immortal</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Need help with mid-round calling, agent selection & eco management. 3 sessions, flexible schedule.
              </p>

              <div className="flex justify-between mb-4 pb-4"
                style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
                <div><p className="text-xs text-slate-500">Budget</p>
                  <p className="font-black text-base"
                    style={{ background: 'linear-gradient(90deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$45/hr</p>
                </div>
                <div><p className="text-xs text-slate-500">Sessions</p><p className="font-semibold text-sm text-white">3 sessions</p></div>
                <div><p className="text-xs text-slate-500">Posted</p><p className="font-semibold text-sm text-green-400">2 min ago</p></div>
              </div>

              {/* Locked contact */}
              <div className="space-y-2">
                <div className="relative rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2.5 text-xs font-mono"
                    style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <span>💬</span>
                    <span className="text-white" style={{ filter: 'blur(5px)' }}>valorantpro_j#1337</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(5,3,20,0.6)', backdropFilter: 'blur(1px)' }}>
                    <Lock size={12} className="text-purple-400 mr-1" />
                    <span className="text-xs font-bold text-purple-300">Subscribe to Unlock</span>
                  </div>
                </div>
              </div>

              {/* Decorative glow bottom */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-12 rounded-full blur-2xl opacity-50"
                style={{ background: 'rgba(124,58,237,0.6)' }} />
            </div>

            {/* Floating notification chip */}
            <div className="absolute top-8 -right-4 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399' }}>
              <Users size={12} /> 3 coaches viewing
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — FOMO MAGNET (Bounty Preview)
      ══════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            🚨 Live Coaching Requests — Right Now
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-black text-white mb-4">
            Players Are Waiting for <span style={{
              background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>You</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            These are real bounties posted in the last hour. Coaches with a Pro subscription can see full contact info and close the lead directly.
          </p>
        </div>

        {/* Bounty Cards horizontal scroll */}
        <div className="flex gap-5 overflow-x-auto pt-6 pb-12 px-2 justify-center flex-wrap lg:flex-nowrap">
          {MOCK_BOUNTIES.map((bounty, i) => (
            <BountyCard key={i} bounty={bounty} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-slate-500 text-sm mb-4">
            +2,397 more active bounties waiting · Updated every 60 seconds
          </p>
          <a href="#pricing">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                boxShadow: '0 0 30px rgba(124,58,237,0.35)',
                color: 'white',
              }}>
              Unlock All Leads — Go Pro
              <ChevronRight size={16} />
            </button>
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS (Dual Track)
      ══════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <h2 className="font-orbitron text-3xl md:text-4xl font-black text-white mb-3">How It Works</h2>
          <p className="text-slate-400">Three steps to your next level — whatever side you&apos;re on.</p>

          {/* Toggle */}
          <div className="inline-flex mt-8 p-1 rounded-xl"
            style={{ background: 'rgba(15,10,40,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
            {(['players', 'coaches'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 capitalize"
                style={activeTab === tab ? {
                  background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                  color: 'white',
                  boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                } : {
                  color: 'rgba(148,163,184,0.7)',
                  background: 'transparent',
                }}>
                {tab === 'players' ? '🎮 For Players' : '🏆 For Coaches'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className="relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(15,10,40,0.8), rgba(20,15,55,0.8))',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}>
              {/* Step number */}
              <span className="absolute top-5 right-5 font-orbitron text-xs font-black tracking-widest"
                style={{ color: 'rgba(124,58,237,0.3)' }}>{item.step}</span>

              {/* Connector line (not on last) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px z-10"
                  style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.4), transparent)' }} />
              )}

              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))',
                  border: '1px solid rgba(139,92,246,0.3)',
                  color: '#a78bfa',
                }}>
                {item.icon}
              </div>

              <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>

              {activeTab === 'coaches' && i === 1 && (
                <a href="#pricing">
                  <button className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors">
                    See pricing <ChevronRight size={12} />
                  </button>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — PRICING
      ══════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-bold tracking-widest uppercase"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)', color: '#c4b5fd' }}>
            💎 Pricing for Coaches
          </div>
          <h2 className="font-orbitron text-3xl md:text-4xl font-black text-white mb-4">
            One Subscription. Unlimited Leads.
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Get access to every active bounty. No subscriptions per lead. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.name} 
              className={`rounded-2xl px-6 py-8 transition-transform duration-300 hover:-translate-y-1 flex flex-col ${
                plan.highlighted 
                  ? 'bg-[#100b20]/90 shadow-[0_0_40px_rgba(124,58,237,0.15)] border border-purple-500/40 relative overflow-hidden scale-[1.02] z-10' 
                  : 'bg-[#0a071a]/90 border border-purple-500/10'
              }`}
              style={{ backdropFilter: 'blur(12px)' }}
            >
              {/* Highlight Glow background */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
              )}
              
              <h3 className="font-orbitron tracking-wide text-sm font-bold mb-6 text-white relative z-10">
                {plan.name}
                {plan.highlighted && <span className="ml-3 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] tracking-widest uppercase border border-purple-500/30">Most Popular</span>}
              </h3>
              
              <p className="text-sm mb-8 text-slate-400 relative z-10 max-w-[280px]">
                {plan.description}
              </p>

              <div className="mb-8 relative z-10">
                <div className="flex items-start gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-orbitron text-white">$</span>
                    <span className="text-5xl font-black font-orbitron leading-none text-white">{plan.price.replace('$', '')}</span>
                  </div>
                  {plan.price !== '$0' && (
                    <p className="text-[12px] leading-tight mt-1">
                      <span className="text-white">Billed monthly</span><br />
                      <span className="text-slate-500">Cancel anytime</span>
                    </p>
                  )}
                  {plan.price === '$0' && (
                    <p className="text-[12px] leading-tight mt-1">
                      <span className="text-white">Free forever</span><br />
                      <span className="text-slate-500">No CC needed</span>
                    </p>
                  )}
                </div>
              </div>

              <Link href={plan.ctaHref} className="relative z-10 block">
                <button className={`w-full py-3 rounded-lg text-sm font-bold mb-3 transition-all duration-200 active:scale-[0.98] ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] text-white hover:opacity-90 clip-chamfer'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white clip-chamfer'
                }`}>
                  {plan.cta}
                </button>
              </Link>

              <p className="text-xs max-w-60 mb-6 text-slate-500 relative z-10">
                {plan.highlighted ? 'Unlock full contact access immediately.' : 'Preview bounties with locked contact fields.'}
              </p>

              <div className="border-t border-purple-500/20 mb-6 relative z-10"></div>

              <div className="space-y-3 relative z-10">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5 shrink-0">
                      <path d="M7.75 14.75a7 7 0 1 0 0-14 7 7 0 0 0 0 14" stroke={plan.highlighted ? "#c4b5fd" : "#64748b"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="m5.65 7.752 1.4 1.4 2.8-2.8" stroke={plan.highlighted ? "#c4b5fd" : "#64748b"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={`text-sm ${plan.highlighted ? 'text-slate-200' : 'text-slate-400'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          Cancel anytime · No contracts · Stripe-secured payments
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — SUPPORTED GAMES
      ══════════════════════════════════════════════════════ */}
      <section className="relative max-w-full mx-auto py-20 overflow-hidden" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
        <h2 className="font-orbitron text-2xl font-black text-white text-center mb-10">
          Supported Games
        </h2>
        
        {/* Seamless Infinite Marquee Carousel */}
        <div className="flex overflow-hidden group w-full relative py-4">
          {/* Gradient fade edges */}
          <div className="absolute top-0 bottom-0 left-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #03020f, transparent)' }} />
          <div className="absolute top-0 bottom-0 right-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #03020f, transparent)' }} />
          
          <div className="flex gap-4 min-w-max animate-marquee group-hover:[animation-play-state:paused] px-2 items-center">
            {([...GAMES, ...GAMES, ...GAMES, ...GAMES]).map((g, idx) => (
              <div
                key={`${g.name}-${idx}`}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer flex-shrink-0 group/game relative overflow-hidden bg-gradient-to-br from-[#0f0a28]/90 to-[#140c32]/95 border border-purple-500/30 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-5px_var(--game-shadow)] hover:border-purple-400/60 hover:from-[#1a0f3c]/95 hover:to-[#221550]/95 min-w-[180px]"
                style={{
                  '--game-shadow': `${g.color}50`
                } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 opacity-0 group-hover/game:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="text-xl drop-shadow-lg transition-transform duration-300 group-hover/game:scale-125 z-10">{g.icon}</span>
                <span className="font-bold text-sm transition-colors duration-300 z-10 text-slate-200 w-max whitespace-nowrap group-hover/game:text-white">
                  {g.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Indicator */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-purple-500/30 bg-purple-900/10">
            <span className="text-sm font-semibold text-purple-300/80 tracking-wide">+6 more coming soon</span>
            <span className="text-sm">✨</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(20,12,60,0.97), rgba(12,8,40,0.97))',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 80px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
          {/* Glow */}
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.4) 0%, transparent 60%)' }} />

          <div className="relative z-10">
            <p className="font-orbitron text-xs font-bold tracking-widest text-purple-400 mb-4 uppercase">Ready to start?</p>
            <h2 className="font-orbitron text-3xl md:text-4xl font-black text-white mb-4">
              Your Next Student Is Waiting
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
              Join 180+ pro coaches already closing leads on GGCOACH. Start your 7-day free trial — no credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/register?plan=pro">
                <button className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 font-black text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] clip-chamfer"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.15)',
                    color: 'white',
                  }}>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="absolute -left-10 top-0 bottom-0 w-8 bg-white opacity-20 skew-x-[-20deg] group-hover:translate-x-[400px] transition-transform duration-700 ease-in-out" />
                  Start Free Trial — 7 Days
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/bounty-board">
                <button className="px-8 py-4 font-bold text-base transition-all duration-200 hover:bg-white/5 clip-chamfer-reverse"
                  style={{ border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
                  Browse Bounties First
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}