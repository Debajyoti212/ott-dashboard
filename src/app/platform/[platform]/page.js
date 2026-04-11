// Platform page: displays content grid with posters, hero banner, and analytics links
import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import getDb from '@/app/lib/db';
import Link from 'next/link';
import PosterImage from '@/app/components/PosterImage';

const platformNames = {
  netflix: 'Netflix',
  prime: 'Amazon Prime',
  hotstar: 'Jio Hotstar',
};

const platformBrands = {
  netflix: 'NETFLIX',
  prime: 'prime video',
  hotstar: 'JioHotstar',
};

export async function generateStaticParams() {
  return [
    { platform: 'netflix' },
    { platform: 'prime' },
    { platform: 'hotstar' },
  ];
}

export default async function PlatformPage({ params }) {
  const { platform } = await params;
  if (!['netflix', 'prime', 'hotstar'].includes(platform)) notFound();

  const session = await getSession();
  if (!session) redirect('/login');

  const db = getDb();
  const titles = db.prepare(`
    SELECT * FROM content
    WHERE platform = ?
    ORDER BY platform_rank ASC
  `).all(platform);

  const groupMap = {};
  titles.forEach(t => {
    const group = t.content_type || 'Other';
    if (!groupMap[group]) groupMap[group] = [];
    groupMap[group].push(t);
  });

  const hero = titles[0];

  return (
    <div className={`platform-page ${platform}`}>
      {/* Navbar */}
      <nav className="platform-navbar">
        <span className="navbar-brand">{platformBrands[platform]}</span>
        <div className="navbar-actions">
          <Link href="/select-platform" className="navbar-back">
            ← Switch Platform
          </Link>
        </div>
      </nav>

      {/* Hero Banner */}
      {hero && (
        <div className="hero-banner">
          <div className="hero-bg" style={{
            background: platform === 'netflix'
              ? 'linear-gradient(135deg, #1a0000 0%, #330000 30%, #0a0a0a 100%)'
              : platform === 'prime'
                ? 'linear-gradient(135deg, #001525 0%, #002040 30%, #0a0a0a 100%)'
                : 'linear-gradient(135deg, #1a1a00 0%, #333300 30%, #0a0a0a 100%)'
          }} />
          <div className="hero-content">
            <span className="hero-badge">{hero.content_type}</span>
            <h1 className="hero-title">{hero.title}</h1>
            <div className="hero-meta">
              <span>⭐ {hero.weighted_rating?.toFixed(1)}</span>
              <span>•</span>
              <span>{hero.release_date?.split('-')[0]}</span>
              <span>•</span>
              <span>{hero.maturity_rating}</span>
              <span>•</span>
              <span>{hero.rank_label}</span>
            </div>
            <p className="hero-description">{hero.description}</p>
            <div className="hero-actions">
              <Link href={`/platform/${platform}/analytics/${hero.content_id}`} className="hero-btn hero-btn-primary">
                📊 View Analytics
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows by Type */}
      {Object.entries(groupMap).map(([group, items]) => (
        <div key={group} className="content-section">
          <h2 className="section-title">{group}s</h2>
          <div className="content-row">
            {items.map(item => (
              <Link
                key={item.content_id}
                href={`/platform/${platform}/analytics/${item.content_id}`}
                className="content-card"
              >
                <div className="card-poster">
                  <PosterImage title={item.title} type={item.content_type} platform={platform} />
                </div>
                <div className="card-info">
                  <div className="card-title">{item.title}</div>
                  <div className="card-meta">
                    <span className="card-rating">
                      <span className="card-rating-star">★</span>
                      {item.weighted_rating?.toFixed(1)}
                    </span>
                    <span>{item.release_date?.split('-')[0]}</span>
                    <span>{item.content_type}</span>
                  </div>
                </div>
                <div className="card-overlay">
                  <div>
                    <div className="card-overlay-text">
                      {item.description?.substring(0, 100)}...
                    </div>
                    <span className="card-overlay-btn">View Analytics →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}