<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
## Architecture Notes

- Database: SQLite via better-sqlite3 (single file, no server needed)
- Auth: Session-based with iron-session
- Data: 4 Kaggle datasets merged into unified schema
- Posters: Fetched live from TMDB API per title
- Charts: Recharts AreaChart with platform-specific colors
- All DB queries are synchronous (better-sqlite3 is sync by design)