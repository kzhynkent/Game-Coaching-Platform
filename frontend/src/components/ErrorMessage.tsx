export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        color: '#f87171',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      ⚠️ {message}
    </div>
  );
}
