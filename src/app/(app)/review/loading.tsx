export default function ReviewLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ borderBottom: '3px solid #000', paddingBottom: '0.75rem' }}>
        <div className="skeleton-box" style={{ width: '220px', height: '36px' }} />
      </div>

      {/* FLASHCARD SKELETON */}
      <div className="skeleton-box" style={{ width: '100%', height: '320px' }} />
    </div>
  );
}
