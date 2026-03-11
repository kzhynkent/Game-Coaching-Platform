'use client';

import { useState, useEffect, useCallback } from 'react';
import { requestsApi, CoachingRequest } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import RequestCard from '@/components/RequestCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';

const GAMES = ['Valorant', 'League of Legends', 'CS2', 'Overwatch 2', 'Apex Legends', 'Dota 2', 'PUBG', 'Fortnite'];

export default function BountyBoardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CoachingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [gameFilter, setGameFilter] = useState('');

  // Display contact fields if the logged-in user is a pro coach,
  // OR if a request belongs to the currently logged-in player (owner check is on the backend)
  const isProCoach = user?.role === 'coach'; // The backend will confirm subscription status

  const fetchRequests = useCallback(async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await requestsApi.getAll(p);
      if (res.success && res.data) {
        setRequests(res.data);
      } else {
        setError(res.error || 'Failed to load bounties.');
      }
    } catch {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests(page);
  }, [page, fetchRequests]);

  const filtered = gameFilter
    ? requests.filter((r) => r.game_title === gameFilter)
    : requests;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          className="font-orbitron"
          style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}
        >
          <span className="gradient-text">Bounty Board</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Active coaching requests from players ready to level up.{' '}
          {!user && (
            <>
              <Link href="/auth/login" style={{ color: '#c4b5fd', textDecoration: 'none', fontWeight: 600 }}>
                Log in as a Pro Coach
              </Link>
              {' '}to unlock contact details.
            </>
          )}
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select
          className="input-field"
          value={gameFilter}
          onChange={(e) => setGameFilter(e.target.value)}
          style={{ maxWidth: '220px' }}
        >
          <option value="">All Games</option>
          {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        {user?.role === 'player' && (
          <Link href="/dashboard">
            <button className="btn-primary" style={{ marginLeft: 'auto' }}>
              + Post a Bounty
            </button>
          </Link>
        )}
      </div>

      {/* Paywall Banner for coaches */}
      {user?.role === 'coach' && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem',
          }}
        >
          <span>✦</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            Contact details are visible only to <span style={{ color: '#c4b5fd', fontWeight: 600 }}>Pro Coaches</span>.
            {' '}Upgrade in Phase 4.
          </span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading bounties..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</p>
          <p style={{ fontWeight: 600 }}>No open bounties found.</p>
          <p style={{ fontSize: '0.875rem' }}>Try clearing the filter or check back later.</p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {filtered.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                showContactFields={isProCoach || req.discord_tag !== null}
              />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              className="btn-ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span style={{ padding: '0.625rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Page {page}
            </span>
            <button
              className="btn-ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={requests.length < 20}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
