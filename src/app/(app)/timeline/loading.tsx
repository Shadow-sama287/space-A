export default function TimelineLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '3px solid #000', paddingBottom: '0.75rem' }}>
        <div className="skeleton-box" style={{ width: '280px', height: '36px' }} />
      </div>

      {/* FILTER CONTROL BAR SKELETON */}
      <div className="skeleton-box" style={{ width: '100%', height: '90px' }} />

      {/* TIMELINE DATE CARDS SKELETON */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-box" style={{ width: '100%', height: '160px' }} />
        ))}
      </div>
    </div>
  );
}
