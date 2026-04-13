// Content API: serves platform content and per-title analytics data from SQLite
import Database from 'better-sqlite3';
import { NextResponse } from 'next/server';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data.db'));

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const content_id = searchParams.get('content_id');

    // Single content detail + analytics
    if (content_id) {
        const content = db.prepare('SELECT * FROM content WHERE content_id = ?').get(content_id);
        const watch_history = db.prepare(
            'SELECT year, month, view_count, watch_minutes FROM watch_history WHERE content_id = ? ORDER BY year, month'
        ).all(content_id);
        return NextResponse.json({ content, watch_history });
    }

    // Platform content listing
    if (platform) {
        const content = db.prepare(
            'SELECT * FROM content WHERE platform = ? ORDER BY platform_rank ASC'
        ).all(platform);
        return NextResponse.json({ content });
    }

    return NextResponse.json({ error: 'Missing platform or content_id param' }, { status: 400 });
}