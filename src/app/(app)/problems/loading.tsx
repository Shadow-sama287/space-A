export default function ProblemsLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ borderBottom: '3px solid #000', paddingBottom: '0.75rem' }}>
        <div className="skeleton-box" style={{ width: '250px', height: '36px' }} />
      </div>

      {/* FILTER BAR SKELETON */}
      <div className="skeleton-box" style={{ width: '100%', height: '80px' }} />

      {/* TABLE ROWS SKELETON */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton-box" style={{ width: '100%', height: '52px' }} />
        ))}
      </div>
    </div>
  );
}
