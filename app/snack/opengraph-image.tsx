import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Snack's Dating Resume";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          fontSize: 28,
          color: '#ff3399',
          fontWeight: 'bold',
          letterSpacing: -0.5,
          marginBottom: 8,
        }}
      >
        My<span style={{ color: '#ffffff' }}>Space</span>
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          background:
            'linear-gradient(90deg, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #8800ff)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: 12,
        }}
      >
        Snack (Zach)
      </div>
      <div style={{ fontSize: 24, color: '#ff3399', fontStyle: 'italic', marginBottom: 24 }}>
        &quot;Sweetie Pie &amp; Cutie Pie&quot;
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          fontSize: 18,
          color: '#999999',
        }}
      >
        <span>Denver, CO</span>
        <span style={{ color: '#333' }}>|</span>
        <span>32</span>
        <span style={{ color: '#333' }}>|</span>
        <span style={{ color: '#00ff66' }}>Online Now!</span>
      </div>
      <div
        style={{
          marginTop: 32,
          padding: '12px 32px',
          border: '2px solid #ff3399',
          borderRadius: 8,
          fontSize: 20,
          color: '#ffffff',
          fontWeight: 'bold',
        }}
      >
        Now Accepting Applications
      </div>
    </div>,
    { ...size },
  );
}
