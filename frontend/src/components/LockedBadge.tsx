import Link from 'next/link';

interface Props {
  label: string;
}

export default function LockedBadge({ label }: Props) {
  return (
    <Link href="/auth/register" style={{ textDecoration: 'none' }}>
      <span className="locked-field" title="Subscribe to Pro to unlock contact details">
        🔒 {label} — <span style={{ color: '#7c3aed', fontWeight: 600 }}>Pro Only</span>
      </span>
    </Link>
  );
}
