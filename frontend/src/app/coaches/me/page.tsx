'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { coachesApi, CoachProfile } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const GAMES = ['Valorant', 'League of Legends', 'CS2', 'Overwatch 2', 'Apex Legends', 'Dota 2', 'PUBG', 'Fortnite', 'Rocket League', 'Other'];
const RANKS = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Challenger', 'Immortal', 'Radiant', 'Other'];

export default function CoachProfileEditorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [bio, setBio] = useState('');
  const [rank, setRank] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'coach')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const res = await coachesApi.getOne(user.id);
    if (res.success && res.data) {
      setProfile(res.data);
      setBio(res.data.bio || '');
      setRank(res.data.rank || '');
      setSelectedGames(res.data.game_expertise || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user?.role === 'coach') loadProfile();
  }, [user, loadProfile]);

  const toggleGame = (game: string) => {
    setSelectedGames((prev) =>
      prev.includes(game) ? prev.filter((g) => g !== game) : [...prev, game]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    const res = await coachesApi.updateMe({ bio, rank, game_expertise: selectedGames });
    setSaving(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadProfile();
    } else {
      setError(res.error || 'Failed to save profile.');
    }
  };

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="font-orbitron" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem' }}>
          <span className="gradient-text">My Coach Profile</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</p>
        {profile && (
          <span className={`badge badge-${profile.subscription_status}`} style={{ marginTop: '0.5rem' }}>
            {profile.subscription_status === 'pro' ? '✦ Pro Coach' : 'Free Tier — Upgrade in Phase 4'}
          </span>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading your profile..." />
      ) : (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && <ErrorMessage message={error} />}
            {success && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '0.875rem 1.25rem', color: '#4ade80', fontSize: '0.875rem' }}>
                ✓ Profile saved successfully!
              </div>
            )}

            {/* Rank */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Your Peak Rank
              </label>
              <select className="input-field" value={rank} onChange={(e) => setRank(e.target.value)}>
                <option value="">Select your peak rank</option>
                {RANKS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bio
              </label>
              <textarea
                className="input-field"
                placeholder="Tell players about your coaching style, achievements, and approach..."
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ resize: 'vertical', minHeight: '120px' }}
              />
            </div>

            {/* Game Expertise */}
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Game Expertise <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'none' }}>(select all that apply)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {GAMES.map((g) => {
                  const selected = selectedGames.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGame(g)}
                      style={{
                        padding: '0.35rem 0.875rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: selected ? 700 : 400,
                        cursor: 'pointer',
                        border: `1px solid ${selected ? 'rgba(124,58,237,0.6)' : 'var(--border)'}`,
                        background: selected ? 'rgba(124,58,237,0.2)' : 'transparent',
                        color: selected ? '#c4b5fd' : 'var(--text-muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {saving ? 'Saving...' : 'Save Profile →'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
