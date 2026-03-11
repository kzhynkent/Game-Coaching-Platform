'use client';

import { useEffect, useState } from 'react';
import { coachesApi, CoachProfile } from '@/lib/api';
import CoachCard from '@/components/CoachCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    coachesApi.getAll().then((res) => {
      if (res.success && res.data) setCoaches(res.data);
      else setError(res.error || 'Failed to load coaches.');
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="font-orbitron" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          <span className="gradient-text">Pro Coaches</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Browse our roster of verified game coaches. Subscribe to Pro to contact them directly via the Bounty Board.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading coaches..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : coaches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</p>
          <p style={{ fontWeight: 600 }}>No coaches yet.</p>
          <p style={{ fontSize: '0.875rem' }}>Be the first to create a coach profile.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {coaches.map((coach) => (
            <CoachCard key={coach.user_id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}
