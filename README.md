# OTT Analytics Dashboard

A multi-platform OTT aggregator with real content analytics — built with Next.js, SQLite, and TMDB API.

## Features
- 🔐 User authentication (register/login)
- 📺 Browse Netflix, Amazon Prime, and Jio Hotstar content
- 📊 Per-title analytics dashboard with:
  - Monthly watch time graph (12-month breakdown)
  - Content ranking (Top 10, 50, 100, 1000+)
  - Weighted ratings and vote counts
  - Peak month detection
- 🎬 Real movie/show posters via TMDB API

## Tech Stack
- **Frontend**: Next.js 16 (App Router)
- **Database**: SQLite via better-sqlite3
- **Data**: Kaggle datasets (Netflix, Prime, Hotstar, Movies)
- **Posters**: TMDB API
- **Charts**: Recharts

## Dataset Sources (Kaggle)
- Netflix Movies and TV Shows
- Amazon Prime Movies and TV Shows
- Disney+ Hotstar TV and Movie Catalog
- The Movies Dataset

## Getting Started

### Prerequisites
- Node.js v18+
- TMDB API key (free at themoviedb.org)

### Installation

```bash
git clone https://github.com/Debajyoti212/ott-dashboard.git
cd ott-dashboard
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

TMDB_API_KEY=your_tmdb_api_key_here
### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure
src/app/
api/
content/      → Content listing API
poster/       → TMDB poster fetcher
components/
WatchTimeChart.js   → Recharts area graph
PosterImage.js      → TMDB poster loader
platform/
[platform]/         → Netflix/Prime/Hotstar pages
analytics/
[titleId]/      → Per-title analytics dashboard
login/
register/
select-platform/
lib/
db.js         → SQLite connection
session.js    → Auth session

## Data Pipeline

Raw data was processed in a Kaggle notebook using Python and pandas:
- 4 Kaggle datasets merged and normalized
- Unified schema across all 3 platforms
- Synthetic watch history generated per title (monthly breakdown)
- Exported as SQLite database (`data.db`)

## Screenshots
<img width="1915" height="975" alt="login png" src="https://github.com/user-attachments/assets/1adfadd9-cc67-4310-9dd4-9c22c24847fd" />


![alt text](netflix.png)
![alt text](select-platform-1.png)
![alt text](analytics2,png.png)

## License

MIT

