'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ChevronDown, ChevronUp, LogOut } from 'lucide-react';

interface Submission {
  id: string;
  name: string;
  age: number;
  location: string;
  instagram: string;
  pitch: string;
  loveLanguage: string;
  oreoPreference: string;
  petOpinion: string;
  idealDate: string;
  travelStyle: string;
  bigSpoon: string;
  dogOpinion?: string;
  submittedAt: string;
}

export default function SnackAdminPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  async function fetchSubmissions() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/myspace/admin/submissions');
      if (res.status === 401) {
        setError('Unauthorized. Please sign in again.');
        return;
      }
      const json = await res.json();
      setSubmissions(json.submissions ?? []);
      setFetched(true);
    } catch {
      setError('Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div style={pageStyle}>
        <p style={{ color: '#999999' }}>Loading...</p>
      </div>
    );
  }

  // Check for error param (e.g., access denied)
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const authError = searchParams?.get('error');

  // Not signed in
  if (!session) {
    return (
      <div style={pageStyle}>
        <div style={loginCardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff3399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h1 style={{ fontSize: '18px', marginTop: '12px', color: '#ffffff' }}>
              Snack&apos;s Admin
            </h1>
            <p style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
              Sign in with Google to view applications
            </p>
          </div>
          {authError && (
            <div
              style={{
                color: '#ff6666',
                fontSize: '12px',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(255, 102, 102, 0.08)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 102, 102, 0.2)',
                textAlign: 'center',
              }}
            >
              {authError === 'AccessDenied'
                ? 'Access denied. Only the site admin can sign in.'
                : 'Authentication error. Please try again.'}
            </div>
          )}
          <button
            onClick={() => signIn('google')}
            style={{
              ...buttonStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Signed in — auto-fetch on first load
  if (!fetched && !loading) {
    fetchSubmissions();
  }

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '800px', width: '100%', padding: '0 12px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingTop: '20px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '18px', color: '#ffffff', margin: 0 }}>
              Friend Requests{' '}
              <span style={{ color: '#ff3399', fontSize: '14px' }}>({submissions.length})</span>
            </h1>
            <p style={{ fontSize: '11px', color: '#555555', marginTop: '4px' }}>
              {session.user?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchSubmissions} style={smallBtnStyle}>
              Refresh
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/myspace/admin' })}
              style={{ ...smallBtnStyle, color: '#999999' }}
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              color: '#ff6666',
              fontSize: '12px',
              marginBottom: '12px',
              padding: '8px 12px',
              background: 'rgba(255, 102, 102, 0.08)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 102, 102, 0.2)',
            }}
          >
            {error}
          </div>
        )}

        {loading && <p style={{ color: '#999999', textAlign: 'center' }}>Loading...</p>}

        {!loading && fetched && submissions.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#555555',
              background: '#111111',
              borderRadius: '6px',
              border: '1px solid #2a2a2a',
            }}
          >
            No applications yet. The queue is empty.
          </div>
        )}

        {submissions.map((s) => (
          <div key={s.id} style={cardStyle}>
            <button
              type="button"
              style={submissionToggleStyle}
              onClick={() => toggleExpanded(s.id)}
              aria-expanded={expanded.has(s.id)}
              aria-controls={`submission-details-${s.id}`}
            >
              <div>
                <span style={{ fontWeight: 'bold', color: '#cc77ff', fontSize: '14px' }}>
                  {s.name}
                </span>
                <span style={{ color: '#999999', fontSize: '12px', marginLeft: '8px' }}>
                  {s.age} &middot; {s.location}
                </span>
                {s.instagram && (
                  <span style={{ color: '#ff3399', fontSize: '12px', marginLeft: '8px' }}>
                    {s.instagram}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#555555', fontSize: '10px' }}>
                  {new Date(s.submittedAt).toLocaleDateString()}
                </span>
                {expanded.has(s.id) ? (
                  <ChevronUp size={14} style={{ color: '#999999' }} />
                ) : (
                  <ChevronDown size={14} style={{ color: '#999999' }} />
                )}
              </div>
            </button>

            {expanded.has(s.id) && (
              <div
                id={`submission-details-${s.id}`}
                style={{ marginTop: '12px', borderTop: '1px solid #2a2a2a', paddingTop: '12px' }}
              >
                <DetailRow label="Pitch" value={s.pitch} />
                <DetailRow label="Love Language" value={s.loveLanguage} />
                <DetailRow label="Oreo Preference" value={s.oreoPreference} />
                <DetailRow label="Pet Opinion" value={s.petOpinion || s.dogOpinion || 'N/A'} />
                <DetailRow label="Ideal Date" value={s.idealDate} />
                <DetailRow label="Travel Style" value={s.travelStyle || 'N/A'} />
                <DetailRow label="Spoon" value={s.bigSpoon} />
                <DetailRow label="Submitted" value={new Date(s.submittedAt).toLocaleString()} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '8px', fontSize: '12px' }}>
      <span
        style={{
          color: '#cc77ff',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: '10px',
        }}
      >
        {label}
      </span>
      <div style={{ color: '#bbbbbb', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{value}</div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100dvh',
  background: '#0a0a0a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  fontFamily: "'Trebuchet MS', Verdana, Arial, sans-serif",
  color: '#ffffff',
};

const loginCardStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  padding: '32px',
  maxWidth: '360px',
  width: '100%',
  marginTop: '80px',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  marginTop: '12px',
  background: 'linear-gradient(180deg, #ff3399 0%, #990044 100%)',
  border: '2px solid #ff4488',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const smallBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#cc77ff',
  padding: '6px 12px',
  fontSize: '11px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const cardStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  padding: '14px 16px',
  marginBottom: '10px',
};

const submissionToggleStyle: React.CSSProperties = {
  width: '100%',
  border: 'none',
  background: 'transparent',
  color: 'inherit',
  padding: 0,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
};
