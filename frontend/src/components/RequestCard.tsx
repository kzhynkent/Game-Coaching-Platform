import { CoachingRequest } from '@/lib/api';
import Link from 'next/link';
import LockedBadge from './LockedBadge';

interface Props {
  request: CoachingRequest;
  showContactFields?: boolean;
}

const GAME_ICONS: Record<string, string> = {
  'Valorant': '🎯',
  'League of Legends': '⚔️',
  'CS2': '💣',
  'Overwatch 2': '🔫',
  'Apex Legends': '🔶',
  'Dota 2': '🔮',
  default: '🎮',
};

export default function RequestCard({ request, showContactFields = false }: Props) {
  const icon = GAME_ICONS[request.game_title] || GAME_ICONS.default;
  const statusClass = `badge badge-${request.status}`;

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.75rem' }}>{icon}</span>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
              {request.game_title}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>
              Target: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{request.target_rank}</span>
            </p>
          </div>
        </div>
        <span className={statusClass}>{request.status}</span>
      </div>

      {/* Goal & Budget */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        marginBottom: '1rem',
        padding: '0.875rem',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Goal</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>{request.goal}</p>
        </div>
        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Budget</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4ade80', margin: 0 }}>${request.budget}/hr</p>
        </div>
      </div>

      {/* Description */}
      {request.description && (
        <p style={{
          fontSize: '0.825rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {request.description}
        </p>
      )}

      {/* Contact Fields (Paywall) */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Contact Details
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {showContactFields && request.discord_tag ? (
            <span style={{ fontSize: '0.825rem', color: '#7dd3fc', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '6px', padding: '0.3rem 0.75rem' }}>
              💬 {request.discord_tag}
            </span>
          ) : (
            <LockedBadge label="Discord" />
          )}
          {showContactFields && request.exact_username ? (
            <span style={{ fontSize: '0.825rem', color: '#c4b5fd', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '6px', padding: '0.3rem 0.75rem' }}>
              👤 {request.exact_username}
            </span>
          ) : (
            <LockedBadge label="Username" />
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <Link href={`/bounty-board/${request.id}`} style={{ textDecoration: 'none' }}>
          <button className="btn-ghost" style={{ padding: '0.35rem 0.875rem', fontSize: '0.78rem' }}>
            View Details →
          </button>
        </Link>
      </div>
    </div>
  );
}
