import { ImageResponse } from 'next/og';
import { siteConfig } from '@/data/site';

export const alt = `${siteConfig.name} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const domain = typeof siteConfig.url === 'string' ? new URL(siteConfig.url).host : 'zachlamb.io';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#2C3E2D',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            fontSize: '24px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#B8860B',
          }}
        >
          {siteConfig.title}
        </div>
        <div
          style={{
            fontSize: '72px',
            fontWeight: 700,
            color: '#F5F0E8',
            lineHeight: 1.1,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: '20px',
            color: '#8B8680',
            maxWidth: '600px',
            textAlign: 'center',
            marginTop: '8px',
          }}
        >
          React · TypeScript · AI-Powered Web Tools
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          fontSize: '18px',
          color: '#6B7F5E',
          letterSpacing: '0.1em',
        }}
      >
        {domain}
      </div>
    </div>,
    { ...size },
  );
}
