// Analytics page: displays per-title watch time, rankings, ratings and monthly graph
import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/app/lib/session';
import getDb from '@/app/lib/db';
import Link from 'next/link';
import WatchTimeChart from '@/app/components/WatchTimeChart';

const platformNames = {
  netflix: 'Netflix',
  prime: 'Amazon Prime',
  hotstar: 'Jio Hotstar',
};

function formatMinutes(val) {
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
  return val.toString();
}

function getRankingClass(label) {
  if (label === 'Top 10') return 'top10';
  if (label === 'Top 50') return 'top50';
  if (label === 'Top 100') return 'top100';
  return 'top1000';
}

function getRankingEmoji(label) {
  if (label === 'Top 10') return '🏆';
  if (label === 'Top 50') return '🥈';
  if (label === 'Top 100') return '🥉';
  return '📊';
}

function renderStars(score) {
  const normalizedScore = score / 2;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(normalizedScore)) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i - 0.5 <= normalizedScore) {
      stars.push(<span key={i} className="star half">★</span>);
    } else {
      stars.push(<span key={i} className="star empty">★</span>);
    }
  }
  return stars;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function AnalyticsPage({ params }) {
  const { platform, titleId } = await params;
  if (!['netflix', 'prime', 'hotstar'].includes(platform)) notFound();

  const session = await getSession();
  if (!session) redirect('/login');

  const db = getDb();

  // Get content info
  const title = db.prepare(`
    SELECT * FROM content
    WHERE content_id = ? AND platform = ?
  `).get(titleId, platform);

  if (!title) notFound();

  // Get watch history (12 months max)
  const watchHistory = db.prepare(`
    SELECT year, month, view_count, watch_minutes
    FROM watch_history
    WHERE content_id = ?
    ORDER BY year ASC, month ASC
    LIMIT 12
  `).all(titleId);

  // Totals
  const totalMinutes = watchHistory.reduce((sum, m) => sum + (m.watch_minutes || 0), 0);
  const totalViews = watchHistory.reduce((sum, m) => sum + (m.view_count || 0), 0);
  const peakMonth = watchHistory.length > 0
    ? watchHistory.reduce((max, m) => m.watch_minutes > max.watch_minutes ? m : max, watchHistory[0])
    : null;

  const rankLabel = title.rank_label || 'Ranked';
  const platformRank = title.platform_rank || 'N/A';

  return (
    <div className={`analytics-page ${platform}`}>
      {/* Header */}
      <header className="analytics-header">
        <Link href={`/platform/${platform}`} className="analytics-back">
          ← Back to {platformNames[platform]}
        </Link>
        <div className="analytics-title-header">
          <h1>Content Analytics</h1>
          <p>{platformNames[platform]} • Dashboard</p>
        </div>
        <Link href="/select-platform" className="analytics-back">
          Switch Platform
        </Link>
      </header>

      {/* Hero Section */}
      <div className="analytics-hero">
        <div className="analytics-poster">
          {title.title}
        </div>
        <div className="analytics-info">
          <h2>{title.title}</h2>
          <div className="analytics-meta">
            <div className="analytics-meta-item">📺 {title.content_type}</div>
            <div className="analytics-meta-item">📅 {title.release_date?.split('-')[0]}</div>
            <div className="analytics-meta-item">⏱ {title.duration_min} min</div>
            <div className="analytics-meta-item">🎭 {title.genre}</div>
            <div className="analytics-meta-item">📋 {title.maturity_rating}</div>
          </div>
          <p className="analytics-description">{title.description}</p>

          <div className="rating-display">
            <div className="rating-stars">
              {renderStars(title.weighted_rating || 0)}
            </div>
            <span className="rating-score">{title.weighted_rating?.toFixed(1)}</span>
            <span className="rating-votes">({title.vote_count?.toLocaleString()} votes)</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <span className={`ranking-badge ${getRankingClass(rankLabel)}`}>
              {getRankingEmoji(rankLabel)} {rankLabel} — #{platformRank} on {platformNames[platform]}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏱</div>
          <div className="stat-label">Total Watch Time</div>
          <div className="stat-value">{formatMinutes(totalMinutes)}</div>
          <div className="stat-sub">minutes across {watchHistory.length} months</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{totalViews.toLocaleString()}</div>
          <div className="stat-sub">across {watchHistory.length} months</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-label">Weighted Rating</div>
          <div className="stat-value">{title.weighted_rating?.toFixed(1)}/10</div>
          <div className="stat-sub">{title.vote_count?.toLocaleString()} user votes</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-label">Peak Month</div>
          <div className="stat-value">
            {peakMonth ? `${monthNames[peakMonth.month - 1]} ${peakMonth.year}` : 'N/A'}
          </div>
          <div className="stat-sub">
            {peakMonth ? `${formatMinutes(peakMonth.watch_minutes)} mins` : 'No data'}
          </div>
        </div>
      </div>

      {/* Watch Time Chart */}
      <div className="chart-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Monthly Watch Time (12-Month Breakdown)</h3>
            <span>From release date · {watchHistory.length} months of data</span>
          </div>
          <WatchTimeChart data={watchHistory} platform={platform} />
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div className="reviews-grid">
        <div className="review-card">
          <div className="review-header">
            <span className="review-source">Weighted Rating</span>
            <span className="review-score">{title.weighted_rating?.toFixed(1)} / 10</span>
          </div>
          <div className="review-bar">
            <div className="review-bar-fill"
              style={{ width: `${(title.weighted_rating || 0) * 10}%` }} />
          </div>
        </div>

        <div className="review-card">
          <div className="review-header">
            <span className="review-source">Vote Count</span>
            <span className="review-score">{title.vote_count?.toLocaleString()}</span>
          </div>
          <div className="review-bar">
            <div className="review-bar-fill"
              style={{ width: `${Math.min(100, (title.vote_count || 0) / 5000)}%` }} />
          </div>
        </div>

        <div className="review-card">
          <div className="review-header">
            <span className="review-source">Platform Rank</span>
            <span className="review-score">#{platformRank}</span>
          </div>
          <div className="review-bar">
            <div className="review-bar-fill"
              style={{ width: rankLabel === 'Top 10' ? '95%' : rankLabel === 'Top 50' ? '70%' : rankLabel === 'Top 100' ? '45%' : '20%' }} />
          </div>
        </div>

        <div className="review-card">
          <div className="review-header">
            <span className="review-source">Rank Tier</span>
            <span className="review-score">{rankLabel}</span>
          </div>
          <div className="review-bar">
            <div className="review-bar-fill"
              style={{ width: rankLabel === 'Top 10' ? '95%' : rankLabel === 'Top 50' ? '70%' : rankLabel === 'Top 100' ? '45%' : '20%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}