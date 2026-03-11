import { CoachProfile } from '@/lib/api';
import Link from 'next/link';

interface Props {
  coach: CoachProfile;
}

export default function CoachCard({ coach }: Props) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          🎮
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {coach.email}
          </p>
          {coach.rank && (
            <p style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', margin: '0.1rem 0 0', fontWeight: 600 }}>
              {coach.rank}
            </p>
          )}
        </div>
        <span className={`badge badge-${coach.subscription_status}`}>
          {coach.subscription_status === 'pro' ? '✦ Pro' : 'Free'}
        </span>
      </div>

      {/* Bio */}
      {coach.bio ? (
        <p
          style={{
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {coach.bio}
        </p>
      ) : (
        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '1rem' }}>
          No bio yet.
        </p>
      )}

      {/* Game Expertise */}
      {coach.game_expertise && coach.game_expertise.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
          {coach.game_expertise.map((g) => (
            <span
              key={g}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                background: 'rgba(124,58,237,0.15)',
                color: '#c4b5fd',
                border: '1px solid rgba(124,58,237,0.3)',
              }}
            >
              {g}
            </span>
          ))}
        </div>
      )}

      <Link href={`/coaches/${coach.user_id}`} style={{ textDecoration: 'none' }}>
        <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '0.5rem', fontSize: '0.8rem' }}>
          View Profile →
        </button>
      </Link>
    </div>
  );
}
