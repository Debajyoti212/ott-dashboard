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
login page 
<img width="1915" height="975" alt="login png" src="https://github.com/user-attachments/assets/1adfadd9-cc67-4310-9dd4-9c22c24847fd" />
selection page 
<img width="1915" height="979" alt="select-platform png" src="https://github.com/user-attachments/assets/a3afb6a3-b99d-4813-bb57-3847992421e3" />
interface
<img width="772" height="922" alt="Screenshot 2026-04-08 211049" src="https://github.com/user-attachments/assets/7e1ba76c-bc18-4855-9021-84a6e64dfcc4" />
analytics 1
<img width="1901" height="978" alt="analytics1 png" src="https://github.com/user-attachments/assets/8d53c918-52d4-4841-9960-eb541c5d3f85" />
analytics2
<img width="1901" height="977" alt="analytics2 png" src="https://github.com/user-attachments/assets/e9a319a1-ae74-4a94-8b2a-5e16cb59df79" />


## Roadmap
- [x] User authentication (register/login)
- [x] Platform selection page
- [x] Real poster images via TMDB API
- [x] Monthly watch time graph
- [x] Content ranking system
- [ ] Search functionality
- [ ] Genre filtering
- [ ] Deploy to Vercel
- [ ] User watch history tracking

## License

MIT
