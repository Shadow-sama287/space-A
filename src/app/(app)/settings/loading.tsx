export default function SettingsLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ borderBottom: '3px solid #000', paddingBottom: '0.75rem' }}>
        <div className="skeleton-box" style={{ width: '280px', height: '36px' }} />
      </div>

      {/* TOP SEARCH BAR SKELETON */}
      <div className="skeleton-box" style={{ width: '100%', height: '54px' }} />

      {/* TWO COLUMN LAYOUT SKELETON */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div className="skeleton-box" style={{ height: '260px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="skeleton-box" style={{ height: '180px' }} />
          <div className="skeleton-box" style={{ height: '180px' }} />
        </div>
      </div>
    </div>
  );
}
