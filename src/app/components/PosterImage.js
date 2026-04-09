'use client';

import { useState, useEffect } from 'react';

export default function PosterImage({ title, type, platform }) {
    const [poster, setPoster] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/poster?title=${encodeURIComponent(title)}&type=${encodeURIComponent(type)}`)
            .then(res => res.json())
            .then(data => {
                setPoster(data.poster);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [title, type]);

    const gradientColors = {
        netflix: 'linear-gradient(135deg, #1a0000, #330000)',
        prime: 'linear-gradient(135deg, #001525, #002040)',
        hotstar: 'linear-gradient(135deg, #1a1a00, #333300)',
    };

    if (loading) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                background: gradientColors[platform] || '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                fontSize: '12px'
            }}>
                Loading...
            </div>
        );
    }

    if (!poster) {
        return (
            <div style={{
                width: '100%',
                height: '100%',
                background: gradientColors[platform] || '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'center',
                padding: '8px',
            }}>
                {title}
            </div>
        );
    }

    return (
        <img
            src={poster}
            alt={title}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
            }}
        />
    );
}