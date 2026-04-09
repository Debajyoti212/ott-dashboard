import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import { logout } from '@/app/actions/auth';
import Link from 'next/link';
import getDb from '@/app/lib/db';

export default async function SelectPlatform() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = getDb();
  const netflixCount = db.prepare("SELECT COUNT(*) as c FROM content WHERE platform = 'netflix'").get().c;
  const primeCount = db.prepare("SELECT COUNT(*) as c FROM content WHERE platform = 'prime'").get().c;
  const hotstarCount = db.prepare("SELECT COUNT(*) as c FROM content WHERE platform = 'hotstar'").get().c;

  return (
    <div className="selector-container">
      <div className="selector-nav">
        <div className="selector-user">
          <div className="selector-avatar">
            {session.userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="selector-username">{session.userName}</span>
        </div>
        <form action={logout}>
          <button type="submit" className="logout-btn">Sign Out</button>
        </form>
      </div>

      <div className="selector-header">
        <h1>Choose Your Platform</h1>
        <p>Select a streaming platform to explore content and analytics</p>
      </div>

      <div className="platforms-grid">
        <Link href="/platform/netflix" className="platform-card netflix">
          <div className="platform-icon">N</div>
          <h2 className="platform-name">Netflix</h2>
          <p className="platform-desc">Stream original movies, TV shows, and documentaries.</p>
          <span className="platform-count">{netflixCount} Titles</span>
        </Link>

        <Link href="/platform/prime" className="platform-card prime">
          <div className="platform-icon">P</div>
          <h2 className="platform-name">Amazon Prime</h2>
          <p className="platform-desc">Watch exclusive series, blockbuster movies, and live sports.</p>
          <span className="platform-count">{primeCount} Titles</span>
        </Link>

        <Link href="/platform/hotstar" className="platform-card hotstar">
          <div className="platform-icon">H</div>
          <h2 className="platform-name">Jio Hotstar</h2>
          <p className="platform-desc">Bollywood hits, cricket, regional content, and Disney+ originals.</p>
          <span className="platform-count">{hotstarCount} Titles</span>
        </Link>
      </div>
    </div>
  );
}
