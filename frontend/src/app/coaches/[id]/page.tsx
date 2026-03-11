'use client';

import { use, useEffect, useState } from 'react';
import { coachesApi, CoachProfile } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';

export default function CoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [coach, setCoach] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    coachesApi.getOne(id).then((res) => {
      if (res.success && res.data) setCoach(res.data);
      else setError(res.error || 'Coach not found.');
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !coach) return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <ErrorMessage message={error || 'Coach not found.'} />
      <Link href="/coaches"><button className="btn-ghost" style={{ marginTop: '1rem' }}>← Back to Coaches</button></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link href="/coaches">
        <button className="btn-ghost" style={{ marginBottom: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
          ← All Coaches
        </button>
      </Link>

      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {/* Avatar + Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
            }}
          >
            🎮
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.25rem', margin: '0 0 0.25rem' }}>{coach.email}</h1>
            {coach.rank && <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>{coach.rank}</p>}
            <span className={`badge badge-${coach.subscription_status}`}>
              {coach.subscription_status === 'pro' ? '✦ Pro Coach' : 'Free Tier'}
            </span>
          </div>
        </div>

        <div className="neon-line" />

        {coach.bio && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>About</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{coach.bio}</p>
          </div>
        )}

        {coach.game_expertise && coach.game_expertise.length > 0 && (
          <div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Game Expertise</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {coach.game_expertise.map((g) => (
                <span key={g} style={{
                  fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: '8px',
                  background: 'rgba(124,58,237,0.15)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)',
                }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Member since {new Date(coach.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
