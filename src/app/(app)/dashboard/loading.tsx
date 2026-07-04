export default function DashboardLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* HEADER SKELETON */}
      <div className="flex-between mb-2" style={{ borderBottom: '3px solid #000', paddingBottom: '0.75rem' }}>
        <div className="skeleton-box" style={{ width: '200px', height: '36px' }} />
        <div className="skeleton-box" style={{ width: '180px', height: '24px' }} />
      </div>

      {/* ACTIVE SHEETS BANNER SKELETON */}
      <div className="skeleton-box" style={{ width: '100%', height: '54px' }} />

      {/* TOP STATS GRIDS SKELETON */}
      <div className="grid-3 mb-2" style={{ gap: '1.5rem' }}>
        <div className="skeleton-box" style={{ height: '140px' }} />
        <div className="skeleton-box" style={{ height: '140px' }} />
        <div className="skeleton-box" style={{ height: '140px' }} />
      </div>

      {/* MAIN TWO COLUMN LAYOUT SKELETON */}
      <div className="grid-main" style={{ gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="skeleton-box" style={{ height: '220px' }} />
          <div className="skeleton-box" style={{ height: '200px' }} />
        </div>
        <div>
          <div className="skeleton-box" style={{ height: '440px' }} />
        </div>
      </div>
    </div>
  );
}
