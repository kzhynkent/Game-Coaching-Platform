'use client';

import Link from 'next/link';

const STATS = [
  { value: '2,400+', label: 'Active Bounties' },
  { value: '180+', label: 'Pro Coaches' },
  { value: '14', label: 'Games Supported' },
];

const GAMES = [
  { name: 'Valorant', icon: '🎯', color: '#ff4655' },
  { name: 'League of Legends', icon: '⚔️', color: '#c89b3c' },
  { name: 'CS2', icon: '💣', color: '#f0c040' },
  { name: 'Overwatch 2', icon: '🔫', color: '#fa9c1e' },
  { name: 'Apex Legends', icon: '🔶', color: '#cd4220' },
  { name: 'Dota 2', icon: '🔮', color: '#9e2a2b' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '6rem 1.5rem 4rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.25rem',
            borderRadius: '9999px',
            background: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            marginBottom: '2rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#c4b5fd',
            letterSpacing: '0.08em',
          }}
        >
          ✦ THE PREMIER COACH MARKETPLACE
        </div>

        <h1
          className="font-orbitron"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="gradient-text">Find Your</span>
          <br />
          <span style={{ color: 'var(--text-primary)' }}>Competitive Edge</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          Players post coaching bounties. Pro coaches claim them. No DMs, no
          discord searches — just ranked results.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/bounty-board">
            <button className="btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              Browse Bounties →
            </button>
          </Link>
          <Link href="/auth/register">
            <button className="btn-ghost" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
              I&apos;m a Coach
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            marginTop: '4rem',
            flexWrap: 'wrap',
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p
                className="font-orbitron gradient-text"
                style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="neon-line" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }} />

      {/* How It Works */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          How It Works
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Three steps. Zero friction.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { step: '01', icon: '📋', title: 'Post a Bounty', desc: 'Describe your game, current rank, and coaching goals. Set a budget. Takes 2 minutes.' },
            { step: '02', icon: '🔍', title: 'Coaches Find You', desc: 'Pro coaches browse the Bounty Board and view your contact details when they subscribe.' },
            { step: '03', icon: '🚀', title: 'Level Up', desc: 'Connect directly. No middleman. No platform cut. Pure coaching value.' },
          ].map((item) => (
            <div key={item.step} className="glass-card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
              <span style={{
                position: 'absolute', top: '1rem', right: '1.25rem',
                fontFamily: 'Orbitron, monospace', fontSize: '0.65rem', fontWeight: 900,
                color: 'rgba(124,58,237,0.3)', letterSpacing: '0.1em',
              }}>
                {item.step}
              </span>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Games */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 700, marginBottom: '2.5rem' }}>
          Supported Games
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {GAMES.map((g) => (
            <div
              key={g.name}
              className="glass-card"
              style={{
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'default',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{g.icon}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{g.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
