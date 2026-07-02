import Link from 'next/link';
import { logout } from '../auth-actions';
import FeedbackDrawer from '@/components/FeedbackDrawer';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
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
