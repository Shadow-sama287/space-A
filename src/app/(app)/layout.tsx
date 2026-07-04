import Link from 'next/link';
import { logout } from '../auth-actions';
import FeedbackDrawer from '@/components/FeedbackDrawer';
import NavigationProgressBar from '@/components/NavigationProgressBar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavigationProgressBar />
      <header className="nav-header">
        <div className="nav-container">
          <Link href="/dashboard" className="nav-logo">
            SPACE A
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/problems" className="nav-link">
                  Explorer
                </Link>
              </li>
              <li>
                <Link href="/review" className="nav-link">
                  Review
                </Link>
              </li>
              <li>
                <Link href="/settings" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Settings
                </Link>
              </li>
              <li>
                <form action={logout}>
                  <button type="submit" className="btn btn-small" style={{ textTransform: 'uppercase', cursor: 'pointer' }}>
                    Logout
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="app-container">{children}</main>
      <FeedbackDrawer />
    </div>
  );
}
