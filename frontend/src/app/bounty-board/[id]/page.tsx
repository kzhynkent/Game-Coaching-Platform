'use client';

import { use, useEffect, useState } from 'react';
import { requestsApi, CoachingRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LockedBadge from '@/components/LockedBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [request, setRequest] = useState<CoachingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    requestsApi.getOne(id).then((res) => {
      if (res.success && res.data) setRequest(res.data);
      else setError(res.error || 'Request not found.');
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !request) return (
    <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <ErrorMessage message={error || 'Request not found.'} />
      <Link href="/bounty-board"><button className="btn-ghost" style={{ marginTop: '1rem' }}>← Back to Bounty Board</button></Link>
    </div>
  );

  const isOwner = user?.id === request.player_id;
  const isProCoach = user?.role === 'coach'; // backend confirms subscription
  const showContact = isOwner || (isProCoach && request.discord_tag !== null);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link href="/bounty-board">
        <button className="btn-ghost" style={{ marginBottom: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
          ← Bounty Board
        </button>
      </Link>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>{request.game_title}</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
              Coaching Request · {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`badge badge-${request.status}`}>{request.status}</span>
        </div>

        <div className="neon-line" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Target Rank', value: request.target_rank, color: 'var(--accent-cyan)' },
            { label: 'Goal', value: request.goal, color: 'var(--text-primary)' },
            { label: 'Budget', value: `$${request.budget}/hr`, color: '#4ade80' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.25rem' }}>{label}</p>
              <p style={{ fontWeight: 700, color, margin: 0, fontSize: '1.05rem' }}>{value}</p>
            </div>
          ))}
        </div>

        {request.description && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Description</p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.875rem' }}>{request.description}</p>
          </div>
        )}

        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Contact Details</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {showContact && request.discord_tag
              ? <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '8px', fontSize: '0.875rem', color: '#7dd3fc' }}>💬 {request.discord_tag}</span>
              : <LockedBadge label="Discord" />}
            {showContact && request.exact_username
              ? <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', fontSize: '0.875rem', color: '#c4b5fd' }}>👤 {request.exact_username}</span>
              : <LockedBadge label="Username" />}
            {showContact && request.social_links
              ? <span style={{ padding: '0.4rem 0.875rem', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '8px', fontSize: '0.875rem', color: '#f9a8d4' }}>🔗 {request.social_links}</span>
              : <LockedBadge label="Social Links" />}
          </div>
        </div>
      </div>
    </div>
  );
}
