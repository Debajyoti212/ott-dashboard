import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const type = searchParams.get('type'); // 'movie' or 'tv'

    if (!title) return NextResponse.json({ poster: null });

    const mediaType = type === 'TV Show' ? 'tv' : 'movie';

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(title)}&api_key=${process.env.TMDB_API_KEY}`
        );
        const data = await res.json();
        const result = data.results?.[0];
        const poster = result?.poster_path
            ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
            : null;

        return NextResponse.json({ poster });
    } catch {
        return NextResponse.json({ poster: null });
    }
}