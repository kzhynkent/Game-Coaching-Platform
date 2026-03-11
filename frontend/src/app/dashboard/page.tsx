'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { requestsApi, CoachingRequest } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const GAMES = ['Valorant', 'League of Legends', 'CS2', 'Overwatch 2', 'Apex Legends', 'Dota 2', 'PUBG', 'Fortnite', 'Other'];
const RANKS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger'];
const GOALS = ['Climb Ranked', 'Learn Fundamentals', 'Improve Mechanics', 'VOD Review', 'Champion/Hero Pool', 'Mental / Mindset', 'Teamplay & Comms'];

const EMPTY_FORM = { game_title: '', target_rank: '', goal: '', budget: '', description: '', discord_tag: '', social_links: '', exact_username: '' };

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<CoachingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'player')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const loadMyRequests = useCallback(async () => {
    setLoading(true);
    const all = await requestsApi.getAll(1, 100);
    if (all.success && all.data) {
      // Filter to only the player's own requests; backend unmasked these already
      const mine = all.data.filter((r) => r.player_id === user?.id);
      setRequests(mine);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    if (user?.role === 'player') loadMyRequests();
  }, [user, loadMyRequests]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const budget = parseFloat(form.budget);
    if (isNaN(budget) || budget < 0) {
      setFormError('Budget must be a valid non-negative number.');
      return;
    }
    setSubmitting(true);
    const res = await requestsApi.create({ ...form, budget });
    setSubmitting(false);
    if (res.success) {
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadMyRequests();
    } else {
      setFormError(res.error || 'Failed to create request.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bounty? This cannot be undone.')) return;
    await requestsApi.delete(id);
    loadMyRequests();
  };

  const handleStatusChange = async (id: string, status: 'open' | 'filled' | 'cancelled') => {
    await requestsApi.update(id, { status });
    loadMyRequests();
  };

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-orbitron" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem' }}>
            <span className="gradient-text">My Bounties</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Bounty'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Post a Coaching Request</h2>
          {formError && <div style={{ marginBottom: '1rem' }}><ErrorMessage message={formError} /></div>}
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Game *</label>
                <select className="input-field" value={form.game_title} onChange={e => setForm(f => ({ ...f, game_title: e.target.value }))} required>
                  <option value="">Select Game</option>
                  {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Target Rank *</label>
                <select className="input-field" value={form.target_rank} onChange={e => setForm(f => ({ ...f, target_rank: e.target.value }))} required>
                  <option value="">Select Rank</option>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal *</label>
                <select className="input-field" value={form.goal} onChange={e => setForm(f => ({ ...f, goal: e.target.value }))} required>
                  <option value="">Select Goal</option>
                  {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Budget ($/hr) *</label>
                <input className="input-field" type="number" min="0" step="0.01" placeholder="e.g. 25" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} required />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Description</label>
              <textarea
                className="input-field"
                placeholder="Describe what you need coaching on..."
                rows={3}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>⚠ Contact info typed here will be automatically scrubbed.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { key: 'discord_tag', label: 'Discord Tag', placeholder: 'YourName#0000' },
                { key: 'exact_username', label: 'In-Game Username', placeholder: 'YourIGN' },
                { key: 'social_links', label: 'Social Link', placeholder: 'twitter.com/you' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label} <span className="badge badge-pro" style={{ padding: '0.1rem 0.4rem', fontSize: '0.6rem' }}>Pro-Only</span></label>
                  <input className="input-field" placeholder={placeholder} value={(form as Record<string, string>)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Bounty →'}
            </button>
          </form>
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <LoadingSpinner text="Loading your bounties..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : requests.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</p>
          <p style={{ fontWeight: 600 }}>No bounties yet.</p>
          <p style={{ fontSize: '0.875rem' }}>Post your first coaching request to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => (
            <div key={req.id} className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontWeight: 700, margin: 0 }}>{req.game_title}</h3>
                    <span className={`badge badge-${req.status}`}>{req.status}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {req.target_rank} · {req.goal} · <span style={{ color: '#4ade80' }}>${req.budget}/hr</span>
                  </p>
                  {req.discord_tag && <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#7dd3fc' }}>💬 {req.discord_tag}</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select
                    className="input-field"
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value as 'open' | 'filled' | 'cancelled')}
                    style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', width: 'auto' }}
                  >
                    <option value="open">Open</option>
                    <option value="filled">Filled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button className="btn-danger" onClick={() => handleDelete(req.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
